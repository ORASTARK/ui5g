export const manifest = {
	"_version": "1.12.0",
	"sap.app": {
		"id": "<%= namespace %>",
		"type": "application",
		"i18n": "i18n/i18n.properties",
		"title": "{{appTitle}}",
		"description": "{{appDescription}}",
		"applicationVersion": {
			"version": "1.0.0"
		}
	},
	"sap.ui": {
		"technology": "UI5",
		"deviceTypes": {
			"desktop": true,
			"tablet": true,
			"phone": true
		},
		"supportedThemes": [
			"sap_hcb",
			"sap_bluecrystal",
			"sap_belize"
		]
	},
	"sap.ui5": {
		"rootView": {
			"viewName": "<%= namespace %>.view.App",
			"type": "XML",
			"async": true,
			"id": "app"
		},
		"dependencies": {
			"minUI5Version": "1.30",
			"libs": {
				"sap.ui.core": {},
				"sap.m": {},
				"sap.tnt": {},
				"sap.ui.layout": {},
				"sap.uxap": {},
				"sap.suite.ui.microchart": {
					"lazy": true
				}
			}
		},
		"models": {
			"i18n": {
				"type": "sap.ui.model.resource.ResourceModel",
				"settings": {
					"bundleName": "<%= namespace %>.i18n.i18n"
				}
			},
			"side": {
				"type": "sap.ui.model.json.JSONModel",
				"uri": "model/sideContent.json"
			},
			"alerts": {
				"type": "sap.ui.model.json.JSONModel",
				"uri": "model/alerts.json"
			},
			"customer": {
				"type": "sap.ui.model.json.JSONModel",
				"uri": "model/customers.json"
			}
		},
		"routing": {
			"config": {
				"routerClass": "sap.m.routing.Router",
				"controlId": "mainContents",
				"viewType": "XML",
				"controlAggregation": "pages",
				"viewPath": "<%= namespace %>.view",
				"async": true
			},
			"routes": [
				{
					"pattern": "",
					"name": "home",
					"target": "home"
				},
				{
					"pattern": "MasterSettings",
					"name": "masterSettings",
					"target": [
						"detailSettings",
						"masterSettings"
					]
				},
				{
					"pattern": "SystemSettings",
					"name": "systemSettings",
					"target": "detailSettings"
				},
				{
					"pattern": "Statistics",
					"name": "statistics",
					"target": "statistics"
				}
			],
			"targets": {
				"home": {
					"viewId": "home",
					"viewName": "Home"
				},
				"appSettings": {
					"viewId": "appSettings",
					"viewName": "settings.AppSettings"
				},
				"masterSettings": {
					"viewId": "masterSettings",
					"viewName": "settings.MasterSettings",
					"controlId": "appSettings",
					"controlAggregation": "masterPages",
					"parent": "appSettings"
				},
				"detailSettings": {
					"viewId": "detailSettings",
					"viewName": "settings.DetailSettings",
					"controlId": "appSettings",
					"controlAggregation": "detailPages",
					"parent": "appSettings"
				},
				"statistics": {
					"viewId": "statistics",
					"viewName": "Statistics"
				}
			}
		}
	}
}