# Generosity

## Project description (Swedish)

Detta projekt bygger ett donations webbapplikation med JS ramverket Angular. Applikationen går utt på att en användare kommer på detta hemsida och anger ett belopp samt namt till ett projekt som användaren vill donera. Detta applikation inriktar alltså till projektarbeten där användare kan ge stöd till projekt. 

Användaren donerar med hjälp av Swish. Som en administratör, kan en admin se ett dashboard med hur många donationer som har blivit skickat under loppet av vecka, månad samt år. 

Detta projekt har skapats från: [Angular CLI](https://github.com/angular/angular-cli) version 17.3.7.

## Angular guide (Added by Sossio)

Guide followed by: https://angular.io/guide/setup-local

Commands used to create this angular project: 
`npm install -g @angular/cli`
`ng new generosity --no-standalone`
`cd generosity`
`npm install --save bootstrap`
`ng serve`

Structure of angular: https://angular.io/guide/file-structure

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Description of choosed framework and comparison of other frameworks (Swedish)
Gruppen har valt att använda Angular som ett JS ramverk. Anledningen bakom är att den har ett struktuerat MVS arkitektur som underlättar förståelse för kod och moduler. Angular är skalbar, responsiv och oberoende från tredje-parts bibliotek. Däremot har angular ofullständig dokumentation och prestanda koncept. 

Till Skillnad från Angular, har däremot React ett optimalt användargränssnitt samt hög effektivitet. Angular jämfört med ett annat ramversk som Vue, har vue enklare dokumentation. Å andra sidan har Vue, presis som Angular, typescript vilket inte används i React. Med typescript ges det möjlighet att öka läsbarheten, skalbarheten samt bettre felhantering till skillnad från javaskript. 

Eftersom detta projektet bygger ett donerings app, har Angular blivit den mest passande ramverk då den ger ett bra stuktur av kodfiler. 
