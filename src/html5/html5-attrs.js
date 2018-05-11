/**
 * @file html5 video attributes
 * @author yuhui06
 * @date 2018/5/11
 * @see https://www.w3.org/TR/html5/semantics-embedded-content.html#the-media-elements
 * @see https://www.w3.org/TR/html5/semantics-embedded-content.html#the-video-element
 * @todo player 对应方法的文档
 */

export const HTML5_WRITABLE_ATTRS = [
    'src',
    'crossOrigin',
    'poster',
    'preload',
    'autoplay',
    'loop',
    'muted',
    'defaultMuted',
    'controls',
    'controlsList',
    'width',
    'height',
    'playsinline',
    'playbackRate',
    'defaultPlaybackRate',
    'volume',
    'currentTime'
];

export const HTML5_WRITABLE_BOOL_ATTRS = [
    'autoplay',
    'loop',
    'muted',
    'defaultMuted',
    'controls',
    'playsinline'
];

export const HTML5_READONLY_ATTRS = [
    'error',
    'currentSrc',
    'networkState',
    'buffered',
    'readyState',
    'seeking',
    'duration',
    'paused',
    'played',
    'seekable',
    'ended',
    'videoWidth',
    'videoHeight'
];

export default [].concat(HTML5_WRITABLE_ATTRS, HTML5_READONLY_ATTRS);