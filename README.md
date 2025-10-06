# Dashboard de Adopción de IA

Dashboard interactivo construido con Next.js y Supabase para visualizar resultados de encuestas de adopción de IA por institución.

## Características

- 📊 Visualizaciones interactivas con Chart.js (gráficos de radar, dona, barras)
- 🔍 Filtrado dinámico por institución
- 📱 Diseño responsive (móvil, tablet, escritorio)
- ⚡ Server-side rendering con Next.js App Router
- 🎨 Estilizado con Tailwind CSS
- 🔒 Integración segura con Supabase

## Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Base de Datos**: Supabase
- **Visualización**: Chart.js + react-chartjs-2
- **Estilos**: Tailwind CSS
- **TypeScript**: Tipado completo
- **Deployment**: Optimizado para Vercel

## Prerequisitos

- Node.js 18+ y npm
- Cuenta de Supabase con acceso a la tabla `encuestas_unificadas`

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd supabase-dashboard
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` y agrega tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aquí
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aquí
```

#### ¿Dónde encontrar las credenciales?

1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
supabase-dashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raíz con fuentes y metadata
│   ├── page.tsx                 # Página principal (Server Component)
│   └── globals.css              # Estilos globales + Tailwind
├── components/                   # Componentes React
│   ├── DashboardClient.tsx      # Componente cliente con lógica de filtrado
│   ├── DashboardLayout.tsx      # Layout del dashboard (header/footer)
│   ├── InstitutionFilter.tsx    # Dropdown de filtro
│   ├── KPICards.tsx             # Tarjetas de KPIs
│   ├── RadarChart.tsx           # Gráfico de radar para métricas
│   ├── DoughnutChart.tsx        # Gráfico de dona
│   ├── BarChart.tsx             # Gráfico de barras horizontales
│   └── WorkflowsTable.tsx       # Tabla de workflows rankeados
├── lib/                         # Utilidades y lógica de negocio
│   ├── supabase/
│   │   ├── client.ts            # Cliente de Supabase (browser)
│   │   ├── server.ts            # Cliente de Supabase (server)
│   │   └── queries.ts           # Funciones de consulta
│   └── data/
│       └── aggregations.ts      # Funciones de agregación de datos
├── types/                       # Definiciones de TypeScript
│   ├── survey.ts                # Tipos de encuestas y métricas
│   └── charts.ts                # Tipos de configuración de gráficos
├── .env.local                   # Variables de entorno (no commitear)
├── .env.example                 # Plantilla de variables de entorno
└── package.json                 # Dependencias del proyecto
```

## Componentes Principales

### Server Components

- **app/page.tsx**: Obtiene datos de Supabase en el servidor

### Client Components

- **DashboardClient**: Maneja el estado de filtrado y coordina todos los componentes
- **InstitutionFilter**: Dropdown para filtrar por institución
- **KPICards**: Muestra métricas principales (participantes, familiaridad, fortaleza, brecha)
- **RadarChart**: Visualiza métricas de madurez en IA
- **DoughnutChart**: Muestra distribución de tiempo operativo
- **BarChart**: Gráficos de barras para LLMs, necesidades de líderes, beneficios, preocupaciones
- **WorkflowsTable**: Tabla con workflows más votados

## Esquema de Datos

La aplicación consume la tabla `encuestas_unificadas` de Supabase con los siguientes campos principales:

- `institucion`: Institución del participante (campo de filtro)
- `familiaridad_score`: Score de familiaridad con IA (1-5)
- `conocimiento_llm`, `conocimiento_prompts`, `conocimiento_agentes`: Métricas de conocimiento
- `org_*`: Métricas organizacionales
- `percep_*`: Métricas de percepción
- `workflows`: JSON con workflows mencionados
- `respuestas_especificas`: JSON con rankings y modelos IA utilizados

## Build y Deployment

### Build local

```bash
npm run build
npm start
```

### Deploy a Vercel

1. **Conecta tu repositorio a Vercel**:
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa tu repositorio de GitHub

2. **Configura las variables de entorno**:
   - En el dashboard de Vercel, ve a **Settings** > **Environment Variables**
   - Agrega:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**:
   - Vercel detectará automáticamente Next.js
   - Click **Deploy**
   - Tu sitio estará disponible en `<tu-proyecto>.vercel.app`

### Deploy manual con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel deploy --prod
```

## Desarrollo

### Agregar nuevas métricas

1. Actualiza los tipos en `types/survey.ts`
2. Crea una función de agregación en `lib/data/aggregations.ts`
3. Agrega el componente de visualización en `components/`
4. Integra en `DashboardClient.tsx`

### Personalizar estilos

Los estilos siguen el patrón de `fl_results.html`:

- **Colores**: Definidos en `types/charts.ts` y `app/globals.css`
- **Fuente**: Inter (Google Fonts) configurada en `app/layout.tsx`
- **Clases custom**: `.kpi-card`, `.chart-container`, `.card-header` en `globals.css`

## Troubleshooting

### Error: "window is not defined"

Los componentes de Chart.js están configurados con manejo de montaje del cliente. Si ves este error, verifica que los componentes de gráficos usen el patrón de `useState` con `mounted`.

### Supabase retorna array vacío

1. Verifica que las variables de entorno estén configuradas correctamente
2. Revisa las políticas RLS (Row Level Security) en Supabase
3. Confirma que la tabla `encuestas_unificadas` existe y tiene datos

### Los gráficos no se actualizan al filtrar

Verifica que `DashboardClient` esté usando `useMemo` para recalcular las métricas cuando cambia `filteredData`.

## Licencia

MAIndset© 2025

## Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.
