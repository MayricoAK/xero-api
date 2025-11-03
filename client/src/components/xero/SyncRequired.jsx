import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import PropTypes from "prop-types";

export const SyncRequired = ({
  onSync,
  isSyncing,
  error,
  onRetry,
  isInitializing = false,
}) => {
  // Show initialization loading
  if (isInitializing) {
    return (
      <div className="mx-auto p-4 md:p-8">
        <div className="px-4 sm:px-6 mb-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">
                Checking Xero connection...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show sync required UI
  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          {error ? (
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          ) : (
            <RefreshCw className="h-12 w-12 text-gray-400 mx-auto" />
          )}
          <h2 className="text-xl font-semibold text-gray-900">
            {error ? "Connection Error" : "Sync Required"}
          </h2>
        </div>

        <div className="space-y-2">
          <p className="text-gray-500">
            {error
              ? "Failed to connect to Xero. Please check your connection and try again."
              : "Please sync with Xero first to use the features."}
          </p>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            onClick={onSync}
            disabled={isSyncing}
            variant="default"
            className="w-full sm:w-auto"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync with Xero
              </>
            )}
          </Button>

          {error && onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Check Connection
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

SyncRequired.propTypes = {
  onSync: PropTypes.func.isRequired,
  isSyncing: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onRetry: PropTypes.func,
  isInitializing: PropTypes.bool,
};
