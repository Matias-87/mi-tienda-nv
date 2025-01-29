import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";


export const changeComponentAnimation =
    trigger('routeAnimation', [
        transition('* => *', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%'
                })
            ], { optional: true }),
            query(':enter', [
                style({ opacity: 0 })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('500ms ease-out', style({ opacity: 0 }))
                ], { optional: true }),
                query(':enter', [
                    animate('500ms ease-out', style({ opacity: 1 }))
                ], { optional: true }),
                query('@*', animateChild(), { optional: true })
            ])
        ])
    ])