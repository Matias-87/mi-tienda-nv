import { animate, animateChild, group, query, state, style, transition, trigger } from "@angular/animations";


export const changeComponentAnimation =
    trigger('routeAnimation', [
        transition('home-page => sales-summary', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    overflow: 'hidden'
                })
            ], { optional: true }),
            query(':enter', [
                style({
                    opacity: 0,
                    left: '100%',
                })
            ], { optional: true }),
            query(':leave', [style({ right: '0%' })], {optional: true}),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('1000ms ease-out', style({
                        opacity: 0,
                        right: '100%'
                    }))
                ], { optional: true }),
                query(':enter', [
                    animate('1000ms ease-out', style({ opacity: 1, left: 0 }))
                ], { optional: true }),
                query('@*', animateChild(), { optional: true })
            ])
        ]),

        transition('sales-summary => home-page', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    overflow: 'hidden'
                })
            ], { optional: true }),
            query(':enter', [
                style({
                    right: '100%',
                    overflow: 'hidden',
                    opacity: 0
                })
            ], { optional: true }),
            query(':leave', [style({ left: '0%', opacity: 1 })], {optional: true}),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('1000ms ease-out', style({ left: '100%', opacity: 0 }))
                ], { optional: true }),
                query(':enter', [
                    animate('1000ms ease-out', style({ right: 0, overflow: 'hidden', opacity: 1 }))
                ], { optional: true }),
                query('@*', animateChild(), { optional: true })
            ])
        ])
    ])

export const fadeInOutAnimation = trigger('fadeInOut', [
    state('visible', style({
        opacity: 1,
        visibility: 'visible'
    })),
    state('hidden', style({
        opacity: 0,
        visibility: 'hidden'
    })),
    transition('hidden <=> visible', [
        // style({visibility: 'visible'}),
        animate('500ms ease-in-out')
    ]),
    // transition('visible => hidden', [
    //     animate('500ms ease-in-out', style({opacity: 0})),
    //     style({visibility: 'hidden'})
    // ])
])