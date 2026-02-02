import { SpeakersPanel } from './speakers-panel';
import { AlertsPanel } from './alerts-panel';
import { SummaryPanel } from './summary-panel';

export function WorkspaceRightPanel() {
  return (
    <div className="workspace-right-panel">
      <SpeakersPanel />
      <AlertsPanel />
      <SummaryPanel />
    </div>
  );
}
