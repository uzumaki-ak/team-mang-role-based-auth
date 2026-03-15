import { getActivityFeed } from "@/app/lib/activity";
import { requireAdmin } from "@/app/lib/guards";

const AuditLogPage = async () => {
  await requireAdmin("/audit-log");
  const activity = await getActivityFeed(20);

  return (
    <div className="space-y-6">
      <div>
        <div className="label">Audit log</div>
        <h2 className="page-title mt-3">System activity</h2>
        <p className="muted mt-2 text-sm">
          A chronological view of recent changes across teams and users.
        </p>
      </div>

      <div className="panel p-5 space-y-4">
        <div className="table">
          <div className="table-row head">
            <div>Event</div>
            <div>Details</div>
            <div>Type</div>
            <div>Timestamp</div>
          </div>
          {activity.length === 0 ? (
            <div className="table-row">
              <div className="muted">No activity yet.</div>
              <div />
              <div />
              <div />
            </div>
          ) : (
            activity.map((item) => (
              <div key={item.id} className="table-row">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="muted text-xs">{item.meta}</div>
                <div className="text-sm">{item.type}</div>
                <div className="muted text-xs">
                  {item.timestamp.toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
