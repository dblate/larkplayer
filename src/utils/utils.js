/**
 * @file 整合 utils 方法，对外输出
 * @author yuhui06
 * @date 2018/5/6
 */

import find from 'array-find';
import includes from 'lodash.includes';
import values from 'lodash.values';
import assign from 'object-assign';

import computedStyle from './computed-style';
import featureDetector from './feature-detector';
import * as guid from './guid';
import mimeTypeMap from './mime-type-map';
import * as obj from './obj';
import toCamelCase from './to-camel-case';
import toTitleCase from './to-title-case';

export default {
    find,
    includes,
    values,
    assign,
    computedStyle,
    featureDetector,
    guid,
    mimeTypeMap,
    obj,
    toCamelCase,
    toTitleCase
}