
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const process = require("process");
const mkdirp = require("mkdirp");

const { getAvailableVersions } = require("./utils/version");

module.exports = class extends Generator {

  constructor(args, opts) {

    super(args, opts);

    this.option("template", { type: String });
    this.option("name", { "default": "project", type: String });
    this.option("ui5namespace", { "default": "ui5.project", type: String });
    this.option("ui5resource", { "default": "openui5.hana.ondemand.com", type: String });
    this.option("electron", { "default": false, type: Boolean });
    this.option("cordova", { "default": false, type: Boolean });
    this.option("jest", { "default": true, type: Boolean });
    this.option("version", { type: String });

  }

  async logLineNew(s = "") {
    // eslint-disable-next-line no-console
    return new Promise(resolve => {
      process.stdout.write(s, resolve);
    });
  }

  clearLine() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  async prompting() {

    // Have Yeoman greet the user.
    this.log(yosay("Welcome to the " + chalk.red("generator-ui5g") + " generator!"));

    // >> cli option mode
    if (this.options.template) {

      const versions = await getAvailableVersions();

      this.log("With cli options configuration.");

      this.props = this.props || {};
      this.props.name = this.options.name;
      this.props.skeleton = this.options.template;
      this.props.dir = this.options.name.replace(/[^a-zA-Z0-9]/g, "");
      this.props.namespace = this.options.ui5namespace;
      this.props.namepath = this.options.namespace.replace(/\./g, "/");
      this.props.ui5Domain = this.options.ui5resource;
      this.props.electron = this.options.electron;
      this.props.cordova = this.options.cordova;
      this.props.version = this.options.version || versions[0];
      this.props.jest = this.options.jest;

      if (this.props.namespace.startsWith("sap")) {
        this.log(`The namespace ${this.props.namespace} start with 'sap'\nIt maybe CAUSE error`);
      }

      return;
    }

    // >> interactive mode

    const { name, namespace, ui5type, skeleton, apptype, version, jest } = await this.prompt([
      {
        type: "list",
        name: "skeleton",
        message: "APP Skeleton?",
        choices: [
          { name: "Empty Project", value: "empty" },
          { name: "Empty Project (Typescript)", value: "empty-ts" },
          { name: "Walk Through", value: "wt" },
          { name: "Walk Through (Typescript)", value: "wt-ts" },
          { name: "Shop Admin Tool", value: "admin" }
        ]
      },
      {
        type: "input",
        name: "name",
        message: "App name?",
        "default": ans => `ui5-${ans.skeleton.toLowerCase()}`
      },
      {
        type: "input",
        name: "namespace",
        validate: ns => {
          if (ns.startsWith("sap")) {
            return `The namespace ${ns} start with 'sap'\nIt maybe CAUSE error`;
          }
          return true;
        },
        message: "App namespace/package?",
        "default": ans=> `ui5.${ans.skeleton.replace(/[\W_]+/g, ".").toLowerCase()}`
      },
      {
        type: "list",
        name: "ui5type",
        message: "OpenUI5 or SAPUI5?",
        choices: [
          {
            name: "OpenUI5",
            value: "openui5",
            checked: true
          },
          {
            name: "SAPUI5",
            value: "sapui5"
          }
        ]
      },
      {
        type: "list",
        name: "version",
        message: "UI5 Version?",
        choices: async(ans)=> {
          const availableVersions = await getAvailableVersions(ans.ui5type);
          return availableVersions.map((v, i) => ({
            name: v,
            value: v
          }));

        }
      },
      {
        type: "list",
        name: "apptype",
        message: "App Type?",
        choices: [
          { name: "Web Application", value: "web" },
          { name: "Electron Application", value: "electron" },
          { name: "Cordova Application (Beta)", value: "cordova" }
        ]
      },
      {
        type: "list",
        name: "jest",
        message: "Jest Test?",
        when: ans => ans.apptype == "web",
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false }
        ]
      }

    ]);

    const dir = name.replace(/[^a-zA-Z0-9]/g, "");
    const namepath = namespace.replace(/\./g, "/");

    const ui5Domain = (ui5type == "openui5" ? "openui5.hana.ondemand.com" : "sapui5.hana.ondemand.com");

    this.props = Object.assign(this.props || {}, { dir, namepath, skeleton, name, namespace, ui5Domain, apptype, version, jest });

    switch (apptype) {
    case "electron":
      this.props.electron = true;
      this.props.jest = false;
      break;
    case "cordova":
      this.props.cordova = true;
      this.props.jest = false;
      break;
    default:
      break;
    }


  }

  writing() {

    const done = this.async();

    const targetPathRoot = path.join(process.cwd(), this.props.dir);

    this.destinationRoot(targetPathRoot);

    // if with electron wrapper
    mkdirp(targetPathRoot)
      .then(() => {

        this.fs.copyTpl(this.templatePath("common"), this.destinationPath(), this.props, {}, { globOptions: { dot: true } });
        this.fs.copyTpl(this.templatePath(this.props.skeleton), this.destinationPath(), this.props, {}, { globOptions: { dot: true } });

        if (this.props.skeleton.endsWith("-ts")) {
          this.fs.copyTpl(this.templatePath("common-ts"), this.destinationPath(), this.props, {}, { globOptions: { dot: true } });
        } else {
          this.fs.copyTpl(this.templatePath("common-js"), this.destinationPath(), this.props, {}, { globOptions: { dot: true } });
        }

        if (this.props.electron) {

          this.fs.copyTpl(this.templatePath("electron"), this.destinationPath(), this.props);

          const oElectronPackageJson = this.fs.readJSON(this.templatePath("electron", ".package.json"));

          oElectronPackageJson.build.appId = this.props.namespace;

          this.fs.extendJSON(this.destinationPath("package.json"), oElectronPackageJson);


        }

        if (this.props.cordova) {

          this.fs.copyTpl(this.templatePath("cordova"), this.destinationPath(), this.props);

          const oCordovaPackageJson = this.fs.readJSON(this.templatePath("cordova", ".package.json"));

          this.fs.extendJSON(this.destinationPath("package.json"), oCordovaPackageJson);

          this.fs.copyTpl(this.templatePath("cordova", "www"), this.destinationPath("www"), this.props, {}, { globOptions: { dot: true } });

        }

        if ((!this.props.cordova) && (!this.props.electron)) { // only web application support jest

          if (this.props.jest) {

            this.fs.copyTpl(this.templatePath("jest-test"), this.destinationPath(), this.props);

            const oJestJson = this.fs.readJSON(this.templatePath("jest-test", ".package.json"));

            this.fs.extendJSON(this.destinationPath("package.json"), oJestJson);

            this.fs.copyTpl(this.templatePath("jest-test", "test"), this.destinationPath("test"), this.props, {}, { globOptions: { dot: true } });

          }

        }


        done();

      });


  }

  installing() {
    this.installDependencies({ npm: true, bower: false, yarn: false });
  }

};
