import { HttpHeaders } from '@angular/common/http';
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
    directUpload({ auth, file, apiUrl, uploader, }) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authentication: auth,
        });
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
    directUploadByActiveRecord({ auth, file, apiUrl, folder, }) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authentication: auth,
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FrYW5pLXVwbG9hZC1maWxlcy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvc2FrYW5pLXVwbG9hZC1maWxlcy9zcmMvbGliL3Nha2FuaS11cGxvYWQtZmlsZXMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQWMsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTdDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQzs7O0FBR3ZELE1BQU0sT0FBTyx3QkFBd0I7SUFDbkMsWUFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFHLENBQUM7SUFFeEMsWUFBWSxDQUFDLEVBQ1gsSUFBSSxFQUNKLElBQUksRUFDSixNQUFNLEVBQ04sUUFBUSxHQUNXO1FBQ25CLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDO1lBQzlCLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxPQUFPLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7UUFFckMsTUFBTSxPQUFPLEdBQUc7WUFDZCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFO29CQUNKLElBQUksRUFBRSxnQkFBZ0I7b0JBQ3RCLFVBQVUsRUFBRTt3QkFDVixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO3dCQUN4QixTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO3dCQUN6QixRQUFRO3dCQUNSLGNBQWMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7cUJBQy9CO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsSUFBSTthQUNiLElBQUksQ0FBQyxHQUFHLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUM7YUFDbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRUQsMEJBQTBCLENBQUMsRUFDekIsSUFBSSxFQUNKLElBQUksRUFDSixNQUFNLEVBQ04sTUFBTSxHQUNhO1FBQ25CLE1BQU0sT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDO1lBQzlCLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxPQUFPLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7UUFFckMsTUFBTSxPQUFPLEdBQUc7WUFDZCxJQUFJLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsVUFBVSxFQUFFO29CQUNWLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7b0JBQ3hCLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7b0JBQzVCLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7b0JBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsTUFBTTtpQkFDUDthQUNGO1NBQ0YsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLElBQUk7YUFDYixJQUFJLENBQUMsR0FBRyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO2FBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELFFBQVEsQ0FBQyxZQUFvQixFQUFFLElBQVUsRUFBRSxPQUFZO1FBQ3JELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDeEQsQ0FBQzs7c0hBakVVLHdCQUF3QjswSEFBeEIsd0JBQXdCLGNBRFgsTUFBTTs0RkFDbkIsd0JBQXdCO2tCQURwQyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRGlyZWN0VXBsb2FkUGFyYW1zIH0gZnJvbSAnLi4vaW50ZXJmYWNlcy9maWxlLWRhdGEuaW50ZXJmYWNlJztcbmltcG9ydCB7IEpzb25BcGkgfSBmcm9tICcuLi9tb2RlbHMvanNvbi1hcGknO1xuXG5pbXBvcnQgeyBEaXJlY3RVcGxvYWQgfSBmcm9tICcuLi9tb2RlbHMvZGlyZWN0LXVwbG9hZCc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU2FrYW5pVXBsb2FkRmlsZXNTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7fVxuXG4gIGRpcmVjdFVwbG9hZCh7XG4gICAgYXV0aCxcbiAgICBmaWxlLFxuICAgIGFwaVVybCxcbiAgICB1cGxvYWRlcixcbiAgfTogRGlyZWN0VXBsb2FkUGFyYW1zKTogT2JzZXJ2YWJsZTxEaXJlY3RVcGxvYWQ+IHtcbiAgICBjb25zdCBoZWFkZXJzID0gbmV3IEh0dHBIZWFkZXJzKHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBBdXRoZW50aWNhdGlvbjogYXV0aCxcbiAgICB9KTtcbiAgICBjb25zdCBvcHRpb25zID0geyBoZWFkZXJzOiBoZWFkZXJzIH07XG5cbiAgICBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgX2pzb25hcGk6IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHR5cGU6ICdkaXJlY3RfdXBsb2FkcycsXG4gICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgZmlsZW5hbWU6IGZpbGUuZGF0YS5uYW1lLFxuICAgICAgICAgICAgZXh0ZW5zaW9uOiBmaWxlLmRhdGEudHlwZSxcbiAgICAgICAgICAgIHVwbG9hZGVyLFxuICAgICAgICAgICAgY29udGVudF9sZW5ndGg6IGZpbGUuZGF0YS5zaXplLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIHRoaXMuaHR0cFxuICAgICAgLnBvc3QoYCR7YXBpVXJsfWAsIHBheWxvYWQsIG9wdGlvbnMpXG4gICAgICAucGlwZShtYXAoKHJlczogYW55KSA9PiBKc29uQXBpLnBhcnNlSnNvbkFwaShEaXJlY3RVcGxvYWQsIHJlcy5kYXRhKSkpO1xuICB9XG5cbiAgZGlyZWN0VXBsb2FkQnlBY3RpdmVSZWNvcmQoe1xuICAgIGF1dGgsXG4gICAgZmlsZSxcbiAgICBhcGlVcmwsXG4gICAgZm9sZGVyLFxuICB9OiBEaXJlY3RVcGxvYWRQYXJhbXMpOiBPYnNlcnZhYmxlPERpcmVjdFVwbG9hZD4ge1xuICAgIGNvbnN0IGhlYWRlcnMgPSBuZXcgSHR0cEhlYWRlcnMoe1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIEF1dGhlbnRpY2F0aW9uOiBhdXRoLFxuICAgIH0pO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IGhlYWRlcnM6IGhlYWRlcnMgfTtcblxuICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHR5cGU6ICdkaXJlY3RfdXBsb2FkcycsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBmaWxlbmFtZTogZmlsZS5kYXRhLm5hbWUsXG4gICAgICAgICAgY29udGVudF90eXBlOiBmaWxlLmRhdGEudHlwZSxcbiAgICAgICAgICBieXRlX3NpemU6IGZpbGUuZGF0YS5zaXplLFxuICAgICAgICAgIGNoZWNrc3VtOiBmaWxlLmNoZWNrc3VtLFxuICAgICAgICAgIGZvbGRlcixcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmh0dHBcbiAgICAgIC5wb3N0KGAke2FwaVVybH1gLCBwYXlsb2FkLCBvcHRpb25zKVxuICAgICAgLnBpcGUobWFwKChyZXM6IGFueSkgPT4gSnNvbkFwaS5wYXJzZUpzb25BcGkoRGlyZWN0VXBsb2FkLCByZXMuZGF0YSkpKTtcbiAgfVxuXG4gIHMzVXBsb2FkKHByZXNpZ25lZFVSTDogc3RyaW5nLCBmaWxlOiBGaWxlLCBoZWFkZXJzOiBhbnkpIHtcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dChwcmVzaWduZWRVUkwsIGZpbGUsIHsgaGVhZGVycyB9KTtcbiAgfVxufVxuIl19