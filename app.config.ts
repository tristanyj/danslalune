export default defineAppConfig({
  ui: {
    primary: 'amber',
    gray: 'cool',
    container: {
      constrained: 'max-w-6xl',
      padding: 'px-6 sm:px-8 lg:px-10',
    },
    button: {
      color: {
        gray: {
          solid:
            'shadow-none ring-1 ring-inset ring-gray-200 dark:ring-gray-700 text-gray-700 dark:text-gray-200 bg-gray-50 hover:bg-gray-100 disabled:bg-gray-50 aria-disabled:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:disabled:bg-gray-800 dark:aria-disabled:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary-950/50 dark:focus-visible:ring-primary-400',
        },
      },
    },
    checkbox: {
      base: 'h-4 w-4 checked:bg-primary-950/60 dark:checked:bg-current dark:checked:border-transparent dark:indeterminate:bg-primary-950/50 dark:indeterminate:border-transparent disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0 focus:ring-transparent focus:ring-offset-transparent cursor-pointer',
      color: 'text-primary-950/50 dark:text-{color}-400',
      inner: 'ms-2 flex flex-col',
      ring: 'focus-visible:ring-2 focus-visible:ring-primary-950/50 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900',
      background: 'bg-white dark:bg-gray-900',
      label: 'text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer',
    },
    toggle: {
      ring: 'focus-visible:ring-2 focus-visible:ring-primary-950/50 dark:focus-visible:ring-{color}-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900',
      active: 'bg-primary-950/60  dark:bg-{color}-400',
    },
    tabs: {
      wrapper: 'relative space-y-0',
      list: {
        tab: {
          base: 'relative inline-flex items-center justify-center flex-shrink-0 w-full ui-focus-visible:outline-0 ui-focus-visible:ring-2 ui-focus-visible:ring-primary-950/50 dark:ui-focus-visible:ring-primary-950/50   ui-not-focus-visible:outline-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 transition-colors duration-200 ease-out',
        },
      },
    },
    slideover: {
      width: 'w-screen',
      height: 'h-screen max-h-[90%]',
      overlay: {
        base: 'fixed inset-0 transition-opacity',
        background: 'bg-gray-400/75 dark:bg-gray-800/75',
        transition: {
          enter: 'ease-in-out duration-500',
          enterFrom: 'opacity-0',
          enterTo: 'opacity-100',
          leave: 'ease-in-out duration-500',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
        },
      },
      base: 'relative flex-1 flex flex-col w-full bg-white/90 focus:outline-none',
      background: 'bg-white/95 dark:bg-gray-900',
    },
    input: {
      padding: {
        '2xs': 'px-2 py-1',
        xs: 'px-2.5 py-1.5',
        sm: 'px-2.5 py-1.5',
        md: 'px-3 py-[0.55rem]',
        lg: 'px-3.5 py-2.5',
        xl: 'px-3.5 py-2.5',
      },
      variant: {
        outline:
          'shadow-none bg-transparent text-gray-900 dark:text-white ring-1 ring-inset ring-{color}-800 dark:ring-{color}-400 focus:ring-1 focus:ring-{color}-800 dark:focus:ring-{color}-400',
        none: 'bg-transparent focus:ring-0 focus:shadow-none',
      },
      color: {
        gray: {
          outline:
            'shadow-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-950/50 dark:focus:ring-primary-400',
        },
      },
    },
  },
});
