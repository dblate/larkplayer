/**
 * @file plugin-store.js 用于存取插件
 * @author yuhui06
 * @date 2018/4/8
 */

import values from 'lodash.values';

import Component from './component';
import MediaSourceHandler from './media-source-handler';
import Plugin from './plugin';
import PluginTypes from './plugin-types';
import {newGUID} from '../utils/guid';
import toCamelCase from '../utils/to-camel-case';

const {UI, MS, OTHERS} = PluginTypes;

function getInitialStore() {
    return {
        [UI]: {},
        [MS]: {},
        [OTHERS]: {}
    }
}

export default {
    store: getInitialStore(),
    validate(plugin, type) {
        switch (type) {
            case UI:
                // return Component.isPrototypeOf(plugin);
                return plugin && plugin.prototype instanceof Component;
            case MS:
                // return MediaSourceHandler.isPrototypeOf(plugin);
                return plugin && plugin.prototype instanceof MediaSourceHandler;
            case OTHERS:
                // return Plugin.isPrototypeOf(plugin);
                return plugin && plugin.prototype instanceof Plugin;
            default:
                return false;
        }
    },
    has(name, type) {
        return this.store[type] && this.store[type][name];
    },
    add(plugin, options = {}, type) {
        if (this.validate(plugin, type)) {
            const name = options.name || toCamelCase(plugin.name) || `plugin_${newGUID()}`;
            plugin._displayName = name;

            if (!this.has(name, type)) {
                this.store[type][name] = plugin;
            }

            return true;
        } else {
            return false;
        }
    },
    delete(name, type) {
        if (this.has(name, type)) {
            delete this.store[type][name];
        }
    },
    clear() {
        this.store = getInitialStore();
    },
    get(name, type) {
        if (this.has(name, type)) {
            return this.store[type][name];
        }
    },
    getAll(type) {
        switch (type) {
            case UI:
                return values(this.store[UI]);
            case MS:
                return values(this.store[MS]);
            case OTHERS:
                return values(this.store[OTHERS]);
            default:
                let allPlugins = [];
                for (let type in this.store) {
                    if (this.store.hasOwnProperty(type)) {
                        allPlugins.concat(values(this.store[type]));
                    }
                }
                return allPlugins;
        }
    }
};





