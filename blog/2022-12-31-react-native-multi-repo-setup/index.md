---
slug: react-native-multi-repo-setup
title: React Native Multi Repo setup
authors: [marcus]
tags: [react-native, mini-apps, multi-repo]
---

## Requirements

You are tasked to setup multiple repositories for a React Native project. Each repository essential serve as a business function, eg: User Login, User Address, Checkout, etc...
Each business team should be able to work in an isolated manner and not be affected by another team.

## Research

Based on the given requirements, it essentially describes a mutli-repo approach to building `react-native` applications. This multi-repo approach is not uncommon in the industry and is frequently used to split business functions into individual teams. However, when you try to google `multi-repo react-native` there are barely any results that is suitable.
Most of the industry today have shifted to using mono-repo because of its convient and easy to develop style.

There are many tools that are designed for mono-repo that can also be used for multi-repo because they are essentially about the same. Just how you place the folders and the `node_modules`.

<!--truncate-->

## Solution

Given that there are multiple repositories, we can have the idea of a `host app` and `mini apps`. Each `mini app` should be able to run without being affected by another team in terms of development and they should not contain any `Native Android/iOS` code.

The `host app` responsibility should be just some important core functions and linking all the `mini apps` together.

So we have to think about **production** and **local development**. 

### Production

Assuming that we aren't try to build `multi-bundles` (this is another rabbit hole we shall explore in the future), let's just say its a single giant bundle. We can have each of the `mini app` team publish their repo into an npm registry.
Then within the `host`, we can just update the `package.json` for that mini app package to a newer version. This solution is not new or special, it is basically the same as `publishing libraries` to public npm registry and letting people to use it.

There are certain things to take note here as well for each mini app `package.json`:

1. Common dependencies such as `react`, `react-native`, `react-navigation`, should be within `peerDependencies` & `devDependencies`. This is because the `host app` should already have these common packages.
2. Adding packages to `dependencies` should be extra careful because it will increase the bundle size dramatically if each team have the same package installed. Probably can be extracted into `peerDependencies` and request for the host app to install it as `dependencies`.

When we want to release a new version of the application, we can simply build the application as is because each team should have updated the `host` package.json accordingly. 

```javascript title="Host App - package.json"

 "dependencies": {
    "react": "18.1.0",
    "react-native": "0.70.6",
    "@my-company/feature-one": "1.0.0",
    "@my-company/feature-two": "1.1.0"
    "@my-company/feature-three": "1.5.0"
    "@my-company/feature-four": "1.3.2"
  },
  "devDependencies": {
    //...omitted
    "@rnx-kit/metro-config": "^1.3.3",
    "@rnx-kit/metro-resolver-symlinks": "^0.1.23",
    //...omitted
  },

```

```javascript title="Mini App - package.json"

 "peerDependencies": {
    "react": "18.1.0",
    "react-native": "0.70.6"
  },
  "devDependencies": {
    "react": "^18.1.0",
    "react-native": "0.70.6"
  }

```

### Local development 

This is the most tricky part in this article. There are many workflows for multi-repo react natives. 

1. Each mini app team will publish a pre-release version of their feature and update the host app packge.json. 
   - The downside to this is that it is difficult to debug. If you found a bug that requires debugging, you have to constantly publish which makes the workflow difficult. Not to mention, if you CICD is slow, its even worse. I mean, this workflow works as well, but not ideal. 

2. Each mini app team simply need to run some command within the mini-app repo to update the host app `metro.config.js` and `node_modules` to allow their package to be resolved properly and symlinked.
   - This solution is ideal because from the eyes of the developer, they just need to run a simple command and they can start development or even debugging. 
   - However, to achieve this, you need to understand how `metro bundler` even work in the first place. 

I have spent weeks understanding `metro bundler` and I have barely scratched the surface to grasp its full potential. It is clear that I prefer the 2nd solution more because from a DX (developer experience) point-of-view, it is easy. No need to understand any complicated stuff, just run a few pre-configured commands.


#### Exploring Metro bundler configurations and its limitations 

`Metro bundler` is famous for not being able to follow symlinks within the `node_modules`. Read more [here](https://github.com/facebook/metro/issues/1).

**Solution 2.1 - Manually updating `metro.config.js` with the appropriate configurations**

- When you bootstrap your mini app, you need to manually symlink certain folders within your `node_modules` to the host app `node_modules`. 
  - This include `react`, `react-native`.
  - Also need to symlink your mini app folder to the host app `node_modules`

```javascript title="Host App - metro.config.js"

// Tells metro where to find your mini app
const extraNodeModules = {
  'feature-one': path.resolve(__dirname, 'node_modules/feature-one'),
  'feature-two': path.resolve(__dirname, 'node_modules/feature-two'),
};

// To watch for changes within the folder
const watchFolders = [
  path.resolve(__dirname, 'node_modules/feature-one'),
  path.resolve(__dirname, 'node_modules/feature-two'),
];
console.log(watchFolders);

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Tells metro where to find your mini app
    extraNodeModules: new Proxy(extraNodeModules, {
      get: (target, name) => {
        // redirects dependencies referenced from micro-app/ to local node_modules
        return name in target
          ? target[name]
          : path.join(process.cwd(), `node_modules/${name.toString()}`);
      },
    }),
  },
  watchFolders,
};

```

**Solution 2.2 - Using rnx-kit packages to help resolve symlinks** 

To resolve this issue, there is a package created by Microsoft RN team to resolve symlinks within node_modules called [rnx-kit/metro-symlinks-resolver](https://github.com/microsoft/rnx-kit/tree/main/packages/metro-resolver-symlinks#readme). 

```javascript title="Host App - metro.config.js"

const watchFolders = [
  "your feature-one full absolute path"
];

const extraNodeModules = {
  "@react-navigation/stack": path.resolve(__dirname, "node_modules/@react-navigation/stack"),
  ...other libraries that requires native changes, can add here too 
};

// `makeMetroConfig helps to ensure there is only 1 copy of "react" and "react-native".
module.exports = makeMetroConfig({
  projectRoot: __dirname,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: true,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // This MetroSymlinksResolver works for normal symlink via "ln -s". yarn/npm links doesnt work.
    resolveRequest: MetroSymlinksResolver(),
    extraNodeModules,
  },
  watchFolders,
});
```

So you can imagine the workflow for Soln 2.2 is like, 

1. cd `host-app` 
2. yarn install (this will install all the dependencies, including the mini apps)
3. cd ..
4. cd `feature-one` 
5. yarn install
6. After running yarn install, we need to symlink our `feature-one` to the host app `node_modules`
   1. `ln -sf $(pwd) host-app/node_modules/`
   2. This assumes that your mini-app folder has the same name as your `package.json` name.
      1. If it is different, then you have to symlink the mini-app `package.json` name to the host's `node_modules` 
7. This will create a symlinked folder -> `host-app/node_modules/feature-one`


:::tip
Symlinking can be tricky because the target path if it already exists, you **cannot overwrite** the actual folder. You have to **delete** that actual folder first and proceed with the symlinking. 
:::
   

You can see that in Soln 2.2, the `metro.config.js` is simpler and we do not need to declare `extraNodeModules` anymore. 


I have some dummy repos to replicate this article
- https://github.com/kohchihao/dummy-feature-app
- https://github.com/kohchihao/dummy-host-app










