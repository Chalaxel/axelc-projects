import { TrainingWeek } from '@shared/types/training';
import * as fs from 'fs';
import { isEmpty } from 'lodash/fp';
import * as path from 'path';

type LoadDict = Record<string, Record<string, Record<string, number>>>;

export class LoadPlanner {
    private static tssLoadDict: LoadDict = {};
    private static hoursLoadDict: LoadDict = {};

    static initializeTSS() {
        if (!isEmpty(this.tssLoadDict)) return;

        const csvPath = path.join(__dirname, './loadDataTables/weekly-tss.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const rawLines = csvContent.trim().split('\n');

        const [header, ...lines] = rawLines.map(line => line.split(','));

        header.slice(2).forEach((annualTSSAverage, index) => {
            this.tssLoadDict[annualTSSAverage] = {};

            lines.forEach(line => {
                const period = line[0];
                const week = line[1];
                const tss = Number(line[index + 2]);
                if (!this.tssLoadDict[annualTSSAverage][period]) {
                    this.tssLoadDict[annualTSSAverage][period] = {};
                }
                this.tssLoadDict[annualTSSAverage][period][week] = tss;
            });
        });
    }

    static initializeHours() {
        const csvPath = path.join(__dirname, './loadDataTables/weekly-training-hours.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const rawLines = csvContent.trim().split('\n');

        const [header, ...lines] = rawLines.map(line => line.split(','));

        header.slice(2).forEach((annualHoursAverage, index) => {
            this.hoursLoadDict[annualHoursAverage] = {};

            lines.forEach(line => {
                const period = line[0];
                const week = line[1];
                const hours = Number(line[index + 2]);
                if (!this.hoursLoadDict[annualHoursAverage][period]) {
                    this.hoursLoadDict[annualHoursAverage][period] = {};
                }
                this.hoursLoadDict[annualHoursAverage][period][week] = hours;
            });
        });
    }

    static calculateLoad(weeks: TrainingWeek[], weeklyHoursConstraint: number): TrainingWeek[] {
        this.initializeTSS();
        this.initializeHours();

        // todo
        return weeks;
    }
}
