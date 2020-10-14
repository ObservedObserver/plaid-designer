import chroma from 'chroma-js';
import { Ensemble } from '@kanaries/ml';
// import { Neighbors } from '@kanaries/ml'
// export convertColor2

export function sortColor (colors: string[]): string[] {
    const iforest = new Ensemble.IsolationForest();
    const colorVecs: number[][] = colors.map(c => chroma(c).hcl());
    iforest.fit(colorVecs)
    const scores: [string, number][] = [];
    for (let i = 0; i < colors.length; i++) {
        scores.push([colors[i], iforest.anomalyScore(colorVecs[i])]);
    }
    scores.sort((a, b) => a[1] - b[1]);
    return scores.map(s => s[0]);
}