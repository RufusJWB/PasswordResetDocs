import {addMatchImageSnapshotCommand} from 'cypress-image-snapshot/command';

addMatchImageSnapshotCommand({
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
  customDiffConfig: {threshold: 0.01},
  capture: 'viewport',
  customSnapshotsDir: 'cypress/snapshots/chrome/minimal',
});
