# roadsurfer-vue

This is a website that you can see bookings of your company easily.

## Tech Stack

Vue3 (Composition API) + Typescript
Vitest
Pinia (Store will be added soon)

## Project Folder Structure

project-root/<br>
│<br>
├── public/<br>
│   └── favicon.ico<br>
│<br>
└── src/<br>
    ├── assets/<br>
    │   ├── base.css<br>
    │   ├── main.css<br>
    │   └── title.svg<br>
    │<br>
    ├── components/<br>
    │   ├── __tests__/<br>
    │   │   ├── CalendarNavbar.spec.ts<br>
    │   │   └── DateNavigation.spec.ts<br>
    │   ├── icons/<br>
    │   │   └── RoadSurferLogo.vue<br>
    │   ├── BookingDetailModal.vue<br>
    │   ├── CalendarInformation.vue<br>
    │   ├── CalendarNavbar.vue<br>
    │   ├── DateNavigation.vue<br>
    │   ├── WeekDays.vue<br>
    │   └── WeeklyCalendar.vue<br>
    │
    ├── models/<br>
    │   ├── AvailableYears.ts<br>
    │   ├── Booking.ts<br>
    │   ├── Event.ts<br>
    │   ├── Months.ts<br>
    │   ├── Station.ts<br>
    │   └── WeekDays.ts<br>
    │
    ├── utils/ 
    │   └── db.ts<br>
    │
    ├── App.vue<br>
    ├── main.ts<br>
    ├── .eslintrc.cjs<br>
    ├── .gitignore.cjs<br>
    ├── .nojekyll<br>
    ├── .prettierrc.json<br>
    ├── .env.d.ts<br>
    ├── index.html<br>
    ├── package-lock.json<br>
    ├── package.json<br>
    ├── postcss.config.js<br>
    ├── README.md<br>
    ├── tailwind.config.js<br>
    ├── tsconfig.app.json<br>
    ├── tsconfig.json<br>
    ├── tsconfig.node.json<br>
    ├── tsconfig.vitest.json<br>
    ├── vite.config.ts<br>
    ├── vitest.config.ts<br>
    └── vue.config.ts<br>

## Sources:

App's UI idea is coming from this component: 
https://tailwindcomponents.com/component/calendar-ui-with-tailwindcss-and-alpinejs <br>
I edited it to be a weekly UI.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```
