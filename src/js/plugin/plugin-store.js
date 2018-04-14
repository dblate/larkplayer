/**
 * @file plugin-store.js 用于存取插件
 * @author yuhui06
 * @date 2018/4/8
 */

import values from 'lodash.values';

import Component from './component';
import MediaSourceHandler from './media-source-handler';
import Plugin from './plugin';
import {UI, MS, OTHERS} from './plugin-types';
import {newGUID} from '../utils/guid';


const initialStore = {
    [UI]: {},
    [MS]: {},
    [OTHERS]: {}
};

const pluginStore = {
    store: initialStore,
    validate(plugin, type) {
        switch (type) {
            case UI:
                return Component.isPrototypeOf(plugin);
                break;
            case MS:
                return MediaSourceHandler.isPrototypeOf(plugin);
                break;
            case OTHERS:
                return Plugin.isPrototypeOf(plugin);
                break;
            default:
                return false;
        }
    },
    has(name, type) {
        return this.store[type] && this.store[type][name];
    },
    add(plugin, options = {}, type) {
        if (this.validate(plugin, type)) {
            const name = options.name || (plugin.name || `plugin_${newGUID()}`).toLowerCase();
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
        this.store = initialStore;
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
                break;
            case MS:
                return values(this.store[MS]);
                break;
            case OTHERS:
                return values(this.store[OTHERS]);
                break;
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

export default pluginStore;






