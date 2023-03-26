/**
 * This file must be kept in sync with `src/renderer/ipc/ipc-event.ts`.
 */

/**
 * Informs the background process that the foreground process has finished loading.
 */
export const FG_LOADED = 'fg:loaded';

/**
 * Informs the background process to create a new tab.
 * Used when the "new tab" button has been clicked on the foreground process.
 */
export const FG_ADD_TAB = 'fg:add-tab';

/**
 * Informs the background process to remove a tab.
 * Used when the "remove tab" button has been clicked on the foreground process.
 */
export const FG_REMOVE_TAB = 'fg:remove-tab';
export interface FgRemoveTabIpcEvent {
  id: string;
}

/**
 * Informs the background process to show a tab.
 * Used when a tab has been clicked on the foreground process.
 */
export const FG_SHOW_TAB = 'fg:show-tab';
export interface FgShowTabIpcEvent {
  id: string;
}

/**
 * Informs the background process to reload the current tab.
 * Used when the reload button is clicked on the foreground process.
 */
export const FG_RELOAD = 'fg:reload';

/**
 * Informs the background process to navigate forward on the current tab.
 * Used when the navigate forward button is clicked on the foreground process.
 */
export const FG_NAV_FORWARD = 'fg:navigate-forward';

/**
 * Informs the background process to navigate back on the current tab.
 * Used when the navigate back button is clicked on the foreground process.
 */
export const FG_NAV_BACK = 'fg:navigate-back';

/**
 * Informs the foreground process to navigate to the "next" tab.
 * Used when the keyboard combination is entered.
 */
export const BG_NEXT_TAB = 'bg:next-tab';

/**
 * Informs the foreground process to navigate to the "previous" tab.
 * Used when the keyboard combination is entered.
 */
export const BG_PREV_TAB = 'bg:prev-tab';

/**
 * Informs the foreground process to add a new tab.
 * Used when when the foreground process has finished loading or the keyboard combination is entered.
 */
export const BG_ADD_TAB = 'bg:add-tab';
export interface BgAddTabIpcEvent {
  id: string;
  url?: string;
}

/**
 * Informs the foreground process to remove the current tab.
 * Used when the keyboard combination is entered.
 */
export const BG_REMOVE_CURRENT_TAB = 'bg:remove-current-tab';

/**
 * Informs the foregroudn process to update a tab's title.
 * Used when a browser view navigates and its title is updated.
 */
export const BG_UPDATE_TAB_TITLE = 'bg:update-tab-title';
export interface BgUpdateTabTitleIpcEvent {
  id: string;
  title: string;
}
