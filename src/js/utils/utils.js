/**
 * @file 整合 utils 各方法，方便对外输出
 * @author yuhui06
 * @date 2018/5/6
 */

import computedStyle from './computed-style';
import featureDetector from './feature-detector';
import * as fn from './fn';
import * as guid from './guid';
import mimeTypeMap from './mime-type-map';
import * as obj from './obj';
import timeFormat from './time-format';
import toCamelCase from './to-camel-case';
import toTitleCase from './to-title-case';

export default {
    computedStyle,
    featureDetector,
    fn,
    guid,
    mimeTypeMap,
    obj,
    timeFormat,
    toCamelCase,
    toTitleCase
}