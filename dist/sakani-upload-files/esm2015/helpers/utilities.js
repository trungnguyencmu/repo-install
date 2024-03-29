import { Subject } from 'rxjs';
import * as SparkMD5 from 'spark-md5';
export const FILE_DATA_STATUS = {
    WAITING: 'waiting',
    UPLOADING: 'uploading',
    UPLOADED: 'uploaded',
    ERROR: 'error',
};
export function ReadAsync(file) {
    const sub = new Subject();
    const reader = new FileReader();
    reader.onerror = (err) => sub.error(err);
    reader.onabort = (err) => sub.error(err);
    reader.onload = () => {
        reader.result && sub.next(reader.result);
        sub.complete();
        reader.abort();
    };
    reader.readAsArrayBuffer(file.data);
    return sub.asObservable();
}
export function GenerateChecksum(data) {
    const spark = new SparkMD5.ArrayBuffer();
    spark.append(data);
    return btoa(spark.end(true));
}
export const dataURIToBlob = (dataURI) => {
    const splitDataURI = dataURI.split(',');
    const byteString = splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
};
export const formatFileSize = (bytes) => {
    if (bytes == 0)
        return 0;
    var k = 1000, i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseInt((bytes / Math.pow(k, i)).toFixed(2));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbGl0aWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc2FrYW5pLXVwbG9hZC1maWxlcy9zcmMvaGVscGVycy91dGlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEtBQUssUUFBUSxNQUFNLFdBQVcsQ0FBQztBQUd0QyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBRztJQUM5QixPQUFPLEVBQUUsU0FBUztJQUNsQixTQUFTLEVBQUUsV0FBVztJQUN0QixRQUFRLEVBQUUsVUFBVTtJQUNwQixLQUFLLEVBQUUsT0FBTztDQUNmLENBQUM7QUFFRixNQUFNLFVBQVUsU0FBUyxDQUFDLElBQXVCO0lBQy9DLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxFQUFlLENBQUM7SUFDdkMsTUFBTSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztJQUNoQyxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7UUFDbkIsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFxQixDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pCLENBQUMsQ0FBQztJQUNGLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsT0FBTyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDNUIsQ0FBQztBQUVELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxJQUFpQjtJQUNoRCxNQUFNLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN6QyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLENBQUMsT0FBZSxFQUFFLEVBQUU7SUFDL0MsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN4QyxNQUFNLFVBQVUsR0FDZCxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDcEMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvRCxNQUFNLEVBQUUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0MsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7SUFFRCxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFhLEVBQVUsRUFBRTtJQUN0RCxJQUFJLEtBQUssSUFBSSxDQUFDO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFDekIsSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUNWLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hELE9BQU8sUUFBUSxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdkQsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0ICogYXMgU3BhcmtNRDUgZnJvbSAnc3BhcmstbWQ1JztcbmltcG9ydCB7IEZpbGVEYXRhSW50ZXJmYWNlIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9maWxlLWRhdGEuaW50ZXJmYWNlJztcblxuZXhwb3J0IGNvbnN0IEZJTEVfREFUQV9TVEFUVVMgPSB7XG4gIFdBSVRJTkc6ICd3YWl0aW5nJyxcbiAgVVBMT0FESU5HOiAndXBsb2FkaW5nJyxcbiAgVVBMT0FERUQ6ICd1cGxvYWRlZCcsXG4gIEVSUk9SOiAnZXJyb3InLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIFJlYWRBc3luYyhmaWxlOiBGaWxlRGF0YUludGVyZmFjZSk6IE9ic2VydmFibGU8QXJyYXlCdWZmZXI+IHtcbiAgY29uc3Qgc3ViID0gbmV3IFN1YmplY3Q8QXJyYXlCdWZmZXI+KCk7XG4gIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gIHJlYWRlci5vbmVycm9yID0gKGVycikgPT4gc3ViLmVycm9yKGVycik7XG4gIHJlYWRlci5vbmFib3J0ID0gKGVycikgPT4gc3ViLmVycm9yKGVycik7XG4gIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgcmVhZGVyLnJlc3VsdCAmJiBzdWIubmV4dChyZWFkZXIucmVzdWx0IGFzIEFycmF5QnVmZmVyKTtcbiAgICBzdWIuY29tcGxldGUoKTtcbiAgICByZWFkZXIuYWJvcnQoKTtcbiAgfTtcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGZpbGUuZGF0YSk7XG4gIHJldHVybiBzdWIuYXNPYnNlcnZhYmxlKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZW5lcmF0ZUNoZWNrc3VtKGRhdGE6IEFycmF5QnVmZmVyKSB7XG4gIGNvbnN0IHNwYXJrID0gbmV3IFNwYXJrTUQ1LkFycmF5QnVmZmVyKCk7XG4gIHNwYXJrLmFwcGVuZChkYXRhKTtcbiAgcmV0dXJuIGJ0b2Eoc3BhcmsuZW5kKHRydWUpKTtcbn1cblxuZXhwb3J0IGNvbnN0IGRhdGFVUklUb0Jsb2IgPSAoZGF0YVVSSTogc3RyaW5nKSA9PiB7XG4gIGNvbnN0IHNwbGl0RGF0YVVSSSA9IGRhdGFVUkkuc3BsaXQoJywnKTtcbiAgY29uc3QgYnl0ZVN0cmluZyA9XG4gICAgc3BsaXREYXRhVVJJWzBdLmluZGV4T2YoJ2Jhc2U2NCcpID49IDBcbiAgICAgID8gYXRvYihzcGxpdERhdGFVUklbMV0pXG4gICAgICA6IGRlY29kZVVSSShzcGxpdERhdGFVUklbMV0pO1xuICBjb25zdCBtaW1lU3RyaW5nID0gc3BsaXREYXRhVVJJWzBdLnNwbGl0KCc6JylbMV0uc3BsaXQoJzsnKVswXTtcblxuICBjb25zdCBpYSA9IG5ldyBVaW50OEFycmF5KGJ5dGVTdHJpbmcubGVuZ3RoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBieXRlU3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgaWFbaV0gPSBieXRlU3RyaW5nLmNoYXJDb2RlQXQoaSk7XG4gIH1cblxuICByZXR1cm4gbmV3IEJsb2IoW2lhXSwgeyB0eXBlOiBtaW1lU3RyaW5nIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IGZvcm1hdEZpbGVTaXplID0gKGJ5dGVzOiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICBpZiAoYnl0ZXMgPT0gMCkgcmV0dXJuIDA7XG4gIHZhciBrID0gMTAwMCxcbiAgICBpID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZyhrKSk7XG4gIHJldHVybiBwYXJzZUludCgoYnl0ZXMgLyBNYXRoLnBvdyhrLCBpKSkudG9GaXhlZCgyKSk7XG59O1xuIl19