/* eslint-disable */
import {FuseNavigationItem} from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Inicio',
        type: 'group',
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/dashboards',
            }
        ]
    },
    {
        id: 'tasks',
        title: 'Tarefas',
        type: 'group',
        children: [
            {
                id: 'magazines-dispatches',
                title: 'Revistas e Despachos',
                type: 'basic',
                icon: 'mat_solid:upload',
                link: '/revistas-e-despachos',
            }
        ]
    },
    {
        id: 'processes',
        title: 'Processos',
        type: 'group',
        children: [
            {
                id: 'brading-process',
                title: 'Marcas',
                type: 'basic',
                icon: 'heroicons_outline:lock-closed',
                link: '/marcas'
            },
            {
                id: 'brading-process',
                title: 'Ordens de Serviços',
                type: 'basic',
                icon: 'heroicons_outline:lock-closed',
                link: '/ordem-servico'
            }
        ]
    },
    {
        id: 'people',
        title: 'Pessoas',
        type: 'group',
        children: [
            {
                id: 'customers',
                title: 'Clientes',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/clientes'
            },
            {
                id: 'users',
                title: 'Usuários',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/usuarios',
            }
        ]
    },
    {
        id: 'settings',
        title: 'Configurações',
        type: 'group',
        children: [
            {
                id: 'roles',
                title: 'Cargos',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/cargos',
            }
        ]
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
