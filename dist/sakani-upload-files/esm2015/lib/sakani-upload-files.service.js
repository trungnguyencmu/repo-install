import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { JsonApi } from '../models/json-api';
import { DirectUpload } from '../models/direct-upload';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class SakaniUploadFilesService {
    constructor(http) {
        this.http = http;
    }
    directUpload({ file, apiUrl, uploader, headers, }) {
        // const headers = new HttpHeaders({
        //   'Content-Type': 'application/json',
        //   Authentication: auth,
        // });
        const options = { headers: headers };
        const payload = {
            _jsonapi: {
                data: {
                    type: 'direct_uploads',
                    attributes: {
                        filename: file.data.name,
                        extension: file.data.type,
                        uploader,
                        content_length: file.data.size,
                    },
                },
            },
        };
        return this.http
            .post(`${apiUrl}`, payload, options)
            .pipe(map((res) => JsonApi.parseJsonApi(DirectUpload, res.data)));
    }
    directUploadByActiveRecord({ file, apiUrl, folder, headers, }) {
        const options = { headers: headers };
        const payload = {
            data: {
                type: 'direct_uploads',
                attributes: {
                    filename: file.data.name,
                    content_type: file.data.type,
                    byte_size: file.data.size,
                    checksum: file.checksum,
                    folder,
                },
            },
        };
        return this.http
            .post(`${apiUrl}`, payload, options)
            .pipe(map((res) => JsonApi.parseJsonApi(DirectUpload, res.data)));
    }
    s3Upload(presignedURL, file, headers) {
        return this.http.put(presignedURL, file, { headers });
    }
}
SakaniUploadFilesService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable });
SakaniUploadFilesService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.17", ngImport: i0, type: SakaniUploadFilesService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FrYW5pLXVwbG9hZC1maWxlcy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc2FrYW5pLXVwbG9hZC1maWxlcy9zcmMvbGliL3Nha2FuaS11cGxvYWQtZmlsZXMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFN0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDOzs7QUFHdkQsTUFBTSxPQUFPLHdCQUF3QjtJQUNuQyxZQUFvQixJQUFnQjtRQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO0lBQUcsQ0FBQztJQUV4QyxZQUFZLENBQUMsRUFDWCxJQUFJLEVBQ0osTUFBTSxFQUNOLFFBQVEsRUFDUixPQUFPLEdBQ1k7UUFDbkIsb0NBQW9DO1FBQ3BDLHdDQUF3QztRQUN4QywwQkFBMEI7UUFDMUIsTUFBTTtRQUNOLE1BQU0sT0FBTyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBRXJDLE1BQU0sT0FBTyxHQUFHO1lBQ2QsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixVQUFVLEVBQUU7d0JBQ1YsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTt3QkFDeEIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTt3QkFDekIsUUFBUTt3QkFDUixjQUFjLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO3FCQUMvQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLElBQUk7YUFDYixJQUFJLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO2FBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELDBCQUEwQixDQUFDLEVBQ3pCLElBQUksRUFDSixNQUFNLEVBQ04sTUFBTSxFQUNOLE9BQU8sR0FDWTtRQUNuQixNQUFNLE9BQU8sR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQztRQUVyQyxNQUFNLE9BQU8sR0FBRztZQUNkLElBQUksRUFBRTtnQkFDSixJQUFJLEVBQUUsZ0JBQWdCO2dCQUN0QixVQUFVLEVBQUU7b0JBQ1YsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtvQkFDeEIsWUFBWSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtvQkFDNUIsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSTtvQkFDekIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixNQUFNO2lCQUNQO2FBQ0Y7U0FDRixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLElBQUksQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7YUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsUUFBUSxDQUFDLFlBQW9CLEVBQUUsSUFBVSxFQUFFLE9BQVk7UUFDckQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUN4RCxDQUFDOztzSEE3RFUsd0JBQXdCOzBIQUF4Qix3QkFBd0IsY0FEWCxNQUFNOzRGQUNuQix3QkFBd0I7a0JBRHBDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEhlYWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBEaXJlY3RVcGxvYWRQYXJhbXMgfSBmcm9tICcuLi9pbnRlcmZhY2VzL2ZpbGUtZGF0YS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSnNvbkFwaSB9IGZyb20gJy4uL21vZGVscy9qc29uLWFwaSc7XG5cbmltcG9ydCB7IERpcmVjdFVwbG9hZCB9IGZyb20gJy4uL21vZGVscy9kaXJlY3QtdXBsb2FkJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBTYWthbmlVcGxvYWRGaWxlc1NlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHt9XG5cbiAgZGlyZWN0VXBsb2FkKHtcbiAgICBmaWxlLFxuICAgIGFwaVVybCxcbiAgICB1cGxvYWRlcixcbiAgICBoZWFkZXJzLFxuICB9OiBEaXJlY3RVcGxvYWRQYXJhbXMpOiBPYnNlcnZhYmxlPERpcmVjdFVwbG9hZD4ge1xuICAgIC8vIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgIC8vICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAvLyAgIEF1dGhlbnRpY2F0aW9uOiBhdXRoLFxuICAgIC8vIH0pO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IGhlYWRlcnM6IGhlYWRlcnMgfTtcblxuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICBfanNvbmFwaToge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ2RpcmVjdF91cGxvYWRzJyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBmaWxlbmFtZTogZmlsZS5kYXRhLm5hbWUsXG4gICAgICAgICAgICBleHRlbnNpb246IGZpbGUuZGF0YS50eXBlLFxuICAgICAgICAgICAgdXBsb2FkZXIsXG4gICAgICAgICAgICBjb250ZW50X2xlbmd0aDogZmlsZS5kYXRhLnNpemUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5odHRwXG4gICAgICAucG9zdChgJHthcGlVcmx9YCwgcGF5bG9hZCwgb3B0aW9ucylcbiAgICAgIC5waXBlKG1hcCgocmVzOiBhbnkpID0+IEpzb25BcGkucGFyc2VKc29uQXBpKERpcmVjdFVwbG9hZCwgcmVzLmRhdGEpKSk7XG4gIH1cblxuICBkaXJlY3RVcGxvYWRCeUFjdGl2ZVJlY29yZCh7XG4gICAgZmlsZSxcbiAgICBhcGlVcmwsXG4gICAgZm9sZGVyLFxuICAgIGhlYWRlcnMsXG4gIH06IERpcmVjdFVwbG9hZFBhcmFtcyk6IE9ic2VydmFibGU8RGlyZWN0VXBsb2FkPiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgaGVhZGVyczogaGVhZGVycyB9O1xuXG4gICAgY29uc3QgcGF5bG9hZCA9IHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdHlwZTogJ2RpcmVjdF91cGxvYWRzJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGZpbGVuYW1lOiBmaWxlLmRhdGEubmFtZSxcbiAgICAgICAgICBjb250ZW50X3R5cGU6IGZpbGUuZGF0YS50eXBlLFxuICAgICAgICAgIGJ5dGVfc2l6ZTogZmlsZS5kYXRhLnNpemUsXG4gICAgICAgICAgY2hlY2tzdW06IGZpbGUuY2hlY2tzdW0sXG4gICAgICAgICAgZm9sZGVyLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnBvc3QoYCR7YXBpVXJsfWAsIHBheWxvYWQsIG9wdGlvbnMpXG4gICAgICAucGlwZShtYXAoKHJlczogYW55KSA9PiBKc29uQXBpLnBhcnNlSnNvbkFwaShEaXJlY3RVcGxvYWQsIHJlcy5kYXRhKSkpO1xuICB9XG5cbiAgczNVcGxvYWQocHJlc2lnbmVkVVJMOiBzdHJpbmcsIGZpbGU6IEZpbGUsIGhlYWRlcnM6IGFueSkge1xuICAgIHJldHVybiB0aGlzLmh0dHAucHV0KHByZXNpZ25lZFVSTCwgZmlsZSwgeyBoZWFkZXJzIH0pO1xuICB9XG59XG4iXX0=