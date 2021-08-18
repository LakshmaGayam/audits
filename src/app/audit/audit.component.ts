import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
@Component({
    templateUrl: 'audit.component.html'
})
export class AuditComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) matSort: MatSort;
    audits: Audit[];
    dateInitialFormat = 'dd-MMM-yyyy hh:mm:ss a';
    displayedColumns: string[] = ['S.No', 'UserName', 'userId', 'Login Time', 'Logout Time', 'IP'];
    dataSource = new MatTableDataSource<Audit>();
    defaultDateFilter = '12';
    paginatationarray: number[] = [5, 25, 50, 100];
    isLoading = false;

    constructor(
        private auditService: AuditService,
    ) {
    }

    ngOnInit() {
        this.loadAllAudits();
    }

    ngAfterViewInit() {
        // this.dataSource.sort = this.matSort;
    }

    private loadAllAudits() {
        this.isLoading = true;
        this.auditService.getAll()
            .pipe(first())
            .subscribe((audits) => {
                if (audits) {
                    this.isLoading = false;
                    this.dataSource.data = audits;
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.matSort;

                }
            }
            ) ,(error) => {this.isLoading = false};
    }
    /**
     * 
     * @param searchValue 
     */
    applyFilter(searchValue: string) {
        // searchValue = searchValue.trim(); // Remove whitespace
        searchValue = searchValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = searchValue;
    }

    /**
     * 
     * @param formatType 
     */
    changeFormat(formatType) {
        if (formatType === '12') {
            this.dateInitialFormat = "dd-MMM-yyyy hh:mm:ss a"
        } else {
            this.dateInitialFormat = "dd-MMM-yyyy HH:mm:ss a"
        }
    }
}