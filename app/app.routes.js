angular
    .module('app')
	.config(mainRoutes)
	.run(startApp);

mainRoutes.$inject = ['$urlMatcherFactoryProvider', '$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider'];

function mainRoutes($urlMatcherFactory, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
    $urlRouterProvider.otherwise("/");
    $urlMatcherFactory.caseInsensitive(true);

    $stateProvider
        .state("landing-page", {
            url: "/",
            views: {
                'main': { templateUrl: "app/components/landing-page/landing-page.html" }
            }
        })
        .state("login", {
            titleLink: "/",
            url: "/Login/:kitchen",
            views: {
                'main': { templateUrl: "app/components/login/login.html?1" }
            }
        })
        .state("register", {
            titleLink: "/",
            url: "/Registrer",
            views: {
                'main': {
                    templateUrl: "app/components/register/register.html?2"
                }
            }
        })
        .state("register.kitchen", {
            titleLink: "/",
            url: "/Kokken/",
            views: {
                'main@': {
                    templateUrl: "app/components/register/kitchen/register-kitchen.html?1"
                }
            }
        })
        .state("register.user", {
            titleLink: "/",
            // Match kitchen with any 3 chars e.g. gl8, ml3
            url: "/{kitchen:.{3}}/",
            views: {
                'main@': {
                    templateUrl: "app/components/register/user/register-user.html?1"
                }
            }
        })
        .state("kitchen", {
            // Match kitchen with any 3 chars e.g. gl8, ml3
            title: "Gangbogen",
            url: "/{kitchen:.{3}}",
            redirectTo: "kitchen.home",
            views: {
                'main': {
                    templateUrl: "app/components/kitchen/kitchen.html?v=1",
                    controller: "KitchenController"
                },
                'left-menu': {
                    templateUrl: "app/components/kitchen/left-menu/left-menu.html"
                }
            }
        })
        .state("kitchen.home", {
            title: "Gangbogen",
            headerType: "normal",
            url: "",
            views: {
                'kitchen': { templateUrl: "app/components/kitchen/dorm-book/dorm-book.html" }
            }

        })

        .state("kitchen.buy-page", {
            headerType: "none",
            title: "Ølsystem",
            url: "/Olsystem",
            views: {
                'kitchen': { templateUrl: "app/components/kitchen/buy-page/buy-page.html?1" }
            }

        })
        .state("kitchen.history", {
            headerType: "none",
            title: "Historik",
            url: "/Historik",
            views: {
                'kitchen': { templateUrl: "app/components/kitchen/history/history.html" }
            }
        })
        .state("kitchen.residents", {
            title: "Beboere",
            headerType: "normal",
            url: "/Beboere",
            views: {
                'kitchen': { templateUrl: "app/components/kitchen/residents/residents.html?2" },
                'search@': { templateUrl: "app/components/kitchen/residents/residents-header.html" }
            }
        })
        .state("kitchen.products", {
            redirectTo: "kitchen.products.own",
            headerType: "medium",
            title: "Produkter",
            url: "/Produkter",
            views: {
                'header@': { templateUrl: "app/components/kitchen/products/header/products-header.html" },
                'search@': { templateUrl: "app/components/kitchen/products/header/products-header-search.html" }
            }
        })
        .state("kitchen.products.own", {
            headerType: "medium",
            title: "Produkter",
            url: "/Egne",
            views: {
                'main@': { templateUrl: "app/components/kitchen/products/products.html" }
            }

        })
        .state("kitchen.products.sbsl", {
            headerType: "medium",
            title: "Produkter",
            url: "/SBSL",
            views: {
                'main@': { templateUrl: "app/components/kitchen/products/products-sbsl.html?1" }
            }

        })
        .state("kitchen.accounting", {
            redirectTo: "kitchen.accounting.status",
            headerType: "medium",
            title: "Regnskab",
            url: "/Regnskab",
            views: {
                'header@': { templateUrl: "app/components/kitchen/accounting/header/accounting-header.html?1" },
                'search@': { templateUrl: "app/components/kitchen/accounting/header/accounting-header-search.html" }
            }
        })
        .state("kitchen.accounting.bills", {
            headerType: "medium",
            title: "Regnskab",
            url: "/Regninger",
            views: {
                'main@': {
                    templateUrl: "app/components/kitchen/accounting/accounting-bills.html"
                }
            }
        })
        .state("kitchen.accounting.overview", {
            headerType: "medium",
            title: "Regnskab",
            url: "/Overblik",
            views: {
                'main@': {
                    templateUrl: "app/components/kitchen/accounting/accounting-overview.html"
                }
            }
        })
        .state("kitchen.accounting.status", {
            headerType: "medium",
            title: "Regnskab",
            url: "/{billId}",
            views: {
                'main@': {
                    templateUrl: "app/components/kitchen/accounting/accounting-status.html"
                }
            }
        })
        .state("kitchen.statistics", {
            headerType: "normal",
            title: "Statistik",
            url: "/Statistik",
            views: {
                'kitchen': {
                    templateUrl: "app/components/kitchen/statistics/statistics.html"
                }
            }
        });
}

function startApp($rootScope, $cookies, auth, $state, amMoment) {
    amMoment.changeLocale('da');

    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current, currentParams) {
        $rootScope.title = next.title || "Egmont kollegiet";
        $rootScope.titleLink = next.titleLink || "javascript:void(0);";
        $rootScope.headerType = next.headerType || "normal";
        if ((next.name.indexOf("register.user") > -1 || next.name.indexOf("register.kitchen") > -1) && !auth.isAuthenticated(false)) {
            event.preventDefault();
            $state.go("landing-page");
            return;
        }
        else if (next.name.indexOf("kitchen") === 0 && !auth.isAuthenticated(true)) {
            event.preventDefault();
            $state.go("landing-page");
            return;
        }
        else if (next.name.indexOf("kitchen") === -1 && auth.isAuthenticated(true)) {
            event.preventDefault();
            $state.go("kitchen.home", { kitchen: auth.kitchen() });
            return;
        }
        if (next.redirectTo) {
            event.preventDefault();
            $state.go(next.redirectTo, nextParams);
        }
    });
};