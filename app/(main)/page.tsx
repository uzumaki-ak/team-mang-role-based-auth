import Link from "next/link";
import React from "react";

const page = async () => {
  const user = false;

  return (
    <div className="min-h-screen mx-auto p-4 md:p-6 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-neutral-800 dark:text-wheat">
          Team Access Management
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl">
          Manage team permissions, roles, and access levels across your
          organization with granular control.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 md:p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-wheat">
            Key Features
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span className="text-neutral-700 dark:text-neutral-300">
                Role-based access control (RBAC)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span className="text-neutral-700 dark:text-neutral-300">
                Team and user management
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span className="text-neutral-700 dark:text-neutral-300">
                Granular permission assignment
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
              <span className="text-neutral-700 dark:text-neutral-300">
                Server-side permission validation
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 md:p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-wheat">
            User Roles & Permissions
          </h2>
          <div className="space-y-4">
            <div className="pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <h3 className="font-medium text-neutral-800 dark:text-wheat">
                Super Admin
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Complete system access with unrestricted privileges
              </p>
            </div>
            <div className="pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <h3 className="font-medium text-neutral-800 dark:text-wheat">
                Admin
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Manage users, teams, and permissions
              </p>
            </div>
            <div className="pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <h3 className="font-medium text-neutral-800 dark:text-wheat">
                Manager
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Team-specific oversight and resource management
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-800 dark:text-wheat">
                Member
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Basic access to assigned resources and tools
              </p>
            </div>
          </div>
        </div>
      </div>

      {user ? (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 md:p-6 max-w-2xl">
          <div className="flex items-start md:items-center flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium text-emerald-800 dark:text-emerald-300">
                Welcome back, <span className="font-semibold">Anikesh</span>
              </h3>
              <p className="text-emerald-700 dark:text-emerald-400 mt-1">
                You are logged in as{" "}
                <span className="font-medium text-emerald-800 dark:text-emerald-300">
                  Team Member
                </span>
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 md:p-6 max-w-2xl shadow-sm">
          <h3 className="text-lg font-medium text-neutral-800 dark:text-wheat mb-3">
            Authentication Required
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-5">
            Please sign in to access team management features or create a new
            account to get started.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 font-medium rounded-lg transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          Need help with team permissions? Contact your system administrator.
        </p>
      </footer>
    </div>
  );
};

export default page;
