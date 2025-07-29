export const mazeGridStyles = {
  // Layout
  container: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8",
  maxWidth: "max-w-4xl mx-auto",
  
  // Header
  header: "text-center mb-8",
  title: "text-3xl font-bold text-gray-800 dark:text-white mb-2",
  statusContainer: "mt-2 flex justify-center",
  
  // Connection Status
  connectionStatus: {
    base: "inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full",
    connected: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    disconnected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    indicator: {
      base: "w-2 h-2 rounded-full",
      connected: "bg-green-500 animate-pulse",
      disconnected: "bg-red-500"
    }
  },
  
  // Controls
controlsContainer: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8",
controlsLayout: "flex flex-wrap items-center justify-center gap-4", // changed justify-between to justify-center
modeSection: "flex gap-3 items-center justify-center", // added justify-center
modeLabel: "text-lg font-semibold text-gray-700 dark:text-gray-200 mr-4 flex items-center justify-center", // added justify-center
buttonGroup: "flex gap-3 items-center justify-center", // added justify-center
  
  // Mode Buttons
  modeButton: {
    base: "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
    active: {
      wall: "bg-gray-400 text-white shadow-lg scale-105",
      start: "bg-green-500 text-white shadow-lg scale-105", 
      goal: "bg-red-500 text-white shadow-lg scale-105"
    },
    inactive: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
  },
  
  // Action Buttons
  solveButton: {
    base: "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
    enabled: "bg-purple-500 hover:bg-purple-600 text-white shadow-lg",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed"
  },
  clearPathButton: "px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors",
  clearGridButton: "px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors",
  backButton: "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors",
  
  // Loading Spinner
  spinner: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin",
  
  // Grid
  gridContainer: "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6",
  gridCenter: "flex justify-center",
  gridWrapper: "inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-lg",
  grid: "grid gap-1 bg-gray-300 dark:bg-gray-600 p-2 rounded",
  
  // Cells
  cell: {
    base: "w-6 h-6 cursor-pointer transition-all duration-150 hover:scale-110 rounded-sm border border-gray-200 dark:border-gray-500",
    empty: "bg-white dark:bg-gray-100 hover:bg-gray-50",
    wall: "bg-gray-800 dark:bg-gray-900 shadow-md",
    start: "bg-green-500 shadow-md animate-pulse",
    goal: "bg-red-500 shadow-md animate-pulse",
    path: "bg-yellow-400 shadow-md"
  },
  
  // Status
  statusSection: "mt-6 text-center",
  statusLayout: "inline-flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300",
  statusItem: "flex items-center gap-2",
  statusIcon: {
    start: "w-3 h-3 bg-green-500 rounded",
    goal: "w-3 h-3 bg-red-500 rounded",
    path: "w-3 h-3 bg-yellow-400 rounded"
  }
};

export type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'path';
export type ModeType = 'wall' | 'start' | 'goal';