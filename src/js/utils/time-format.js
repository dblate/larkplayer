/**
 * @file time-format.js 将秒数格式化为指定的时间字符串形式
 * @author yuhui<yuhui06@baidu.com>
 * @date 2017/11/3
 */

/**
 * 将秒数格式化为 hh:mm:ss 的形式
 *
 * @param {number} seconds 要转化的秒数
 * @return {string} 格式化后的表示时间的字符串
 */

/**
 * 不足两位的时间，前面补零
 *
 * @inner
 *
 * @param {string|number} val 该段位的时间（如 1h 12h 23m 1s）
 * @return {string} 进行过不足两位前面补零操作的时间串
 */
function pad(val) {
    val = '' + val;
    if (val.length < 2) {
        val = '0' + val;
    }

    return val;
}

/**
 * 将传入的秒数格式化为 hh:mm:ss 的形式，如果不足一小时，则为 mm:ss 的形式
 *
 * @param {number} seconds 总秒数
 * @return {string} 格式化后的时间串
 */
export function timeFormat(seconds) {
    seconds = parseInt(seconds, 10);
    if (!isNaN(seconds)) {
        let hour = Math.floor(seconds / 3600);
        let minute = Math.floor((seconds - hour * 3600) / 60);
        let second = seconds % 60;

        let result = [pad(minute), pad(second)];
        if (hour > 0) {
            result.unshift(pad(hour));
        }

        return result.join(':');
    } else {
        return '- -';
    }
}