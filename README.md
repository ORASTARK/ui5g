# generator-ui5g

[![npm version](https://badge.fury.io/js/generator-ui5g.svg)](https://www.npmjs.com/package/generator-ui5g)

The ultimate generator for UI5

## [CHANGELOG](./CHANGELOG.md)

## TO-DO

* webpack support
* commit check
* auto import support based on openui5 type
* inline thirdparty library

## Features

* FULL ES6 feat support
* React `JSX` syntax support
* FULL compile to ui5 code
* `Component-preload` file generate
* predefined `vscode`, `eslint`, `babel` and `gulp` config

## Limitation

* Just a complier, not a runtime
* Can't generated `bundle.js` file as `React` or `Vue`, but you can generate `Component-preload.js`, sometimes they are equivalent

## A sample view file syntax

code

```jsx
import JSView from "sap/ui/core/mvc/JSView";
import Page from "sap/m/Page";
import Button from "sap/m/Button";


export default class App extends JSView {

  createContent(C) {
    return (
      <Page
        headerContent={
          <Button
            icon="sap-icon://hello-world"
            press={() => {
              this.oController.getOwnerComponent().openHelloDialog();
            }}
          />
        }
      >
        <JSView viewName="sample.ui.components.HelloPanel" />
        <JSView viewName="sample.ui.components.InvoiceList" />
      </Page>
    );
  }

}

```

compiled

```js
sap.ui.define("sample/ui/components/Overview", ["sap/ui/core/mvc/JSView", "sap/m/Page", "sap/m/Button"], function (JSView, Page, Button) {
  var _default = {};

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  _default = _extends(sap.ui.jsview("sample.ui.components.Overview", {
    createContent: function createContent(C) {
      var _this = this;

      return new Page({
        headerContent: new Button({
          icon: "sap-icon://hello-world",
          press: function press() {
            _this.oController.getOwnerComponent().openHelloDialog();
          }
        }),
        content: [new JSView({
          viewName: "sample.ui.components.HelloPanel"
        }), new JSView({
          viewName: "sample.ui.components.InvoiceList"
        })]
      });
    },
    getControllerName: function getControllerName() {
      return "sample.ui.components.Overview";
    }
  }) || {}, _default);
  return _default;
})
//# sourceMappingURL=../sourcemap/components/Overview.view.js.map

```

## Installation

Firstly, install [Yeoman](http://yeoman.io) and generator-ui5g using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)). [Here](https://github.com/Soontao/ui5g-generate-proj) is a generated sample app

```bash
npm i -g yo generator-ui5g
```

## Generate Project

Then generate your new project:

```bash
# --- start generate
yo ui5g
# --- ask three questions
? App name
? App namespace
? SAPUI5 or OpenUI5?
# --- use openui5 if you dont know what is sapui5
```

And project will be generated in a new folder, the folder name is same as app name.

Dependencies will be auto installed

## Dev

This template is based on [UI5 Walkthrough](https://sapui5.hana.ondemand.com/test-resources/sap/m/demokit/tutorial/walkthrough/37/webapp/test/mockServer.html?sap-ui-theme=sap_belize), It contains most features of ui5

start your project

```bash
npm start
```

## Configuration

* ```babel```, edit ```.babelrc``` to modify babel behavior, for example, make sourcemap inline

* ```eslint```, edit ```.eslintrc``` to modify eslint lint config, by default, new project will use most rules of ui5 standard, only add es6 and other essential rules.

* ```gulp```, edit ```gulpfile.js``` to modify gulp task and other task behavior, you can add *sass* or *uglify* or other processes manually, or adjust *src*/*dist* directory

* ```proxy```, edit ```proxies.js```, supported by gulp connect, use a tranditional node lib, it can set local proxy to remote server

## Command

* ```npm start```, default *gulp* will start a hot reload server, based on BrowserSync.
  
  PLEASE NOTE THAT: ALL COMPILED FILES ARE STORAGE IN MEMORY WHEN DEVELOPING
  
* ```npm run build```, build files to *dist* directory, and ```Component-preload.js``` will be created.

## About

This generator is written by `Theo` but some ideas come from `Madeleine`, and it only can generate really simple project.

Very pleased to be able to help you.
