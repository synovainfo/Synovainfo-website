'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface ArchDiagramProps {
  type: 'manufacturing' | 'supply-chain' | 'financial'
  className?: string
}

/* ─── Manufacturing: IoT → Kafka → Analytics → Dashboard ─── */
function ManufacturingArch() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      {/* IoT Sensors */}
      <g>
        <motion.rect
          x="10" y="20" width="70" height="36" rx="6"
          className="fill-[var(--color-accent-blue)]/10 stroke-[var(--color-accent-blue)]"
          strokeWidth="1.5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        />
        <text x="45" y="37" textAnchor="middle" className="fill-[var(--color-accent-blue)] text-[8px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          IoT Sensors
        </text>
        <text x="45" y="47" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          14 plants
        </text>
      </g>

      {/* Arrow */}
      <motion.path
        d="M80 38h20"
        stroke="var(--color-accent-cyan)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <polygon points="100,33 108,38 100,43" fill="var(--color-accent-cyan)" />

      {/* Kafka */}
      <g>
        <motion.rect
          x="110" y="16" width="70" height="44" rx="6"
          className="fill-[var(--color-accent-purple)]/10 stroke-[var(--color-accent-purple)]"
          strokeWidth="1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <text x="145" y="33" textAnchor="middle" className="fill-[var(--color-accent-purple)] text-[8px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          Kafka
        </text>
        <text x="145" y="43" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          Event Stream
        </text>
        <text x="145" y="51" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          120K msg/s
        </text>
      </g>

      {/* Arrow */}
      <motion.path
        d="M180 38h20"
        stroke="var(--color-accent-cyan)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <polygon points="200,33 208,38 200,43" fill="var(--color-accent-cyan)" />

      {/* Analytics */}
      <g>
        <motion.rect
          x="210" y="16" width="75" height="44" rx="6"
          className="fill-[var(--color-accent-emerald)]/10 stroke-[var(--color-accent-emerald)]"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <text x="247" y="33" textAnchor="middle" className="fill-[var(--color-accent-emerald)] text-[8px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          Analytics
        </text>
        <text x="247" y="43" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          Real-time ML
        </text>
        <text x="247" y="51" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          Anomaly Detection
        </text>
      </g>

      {/* Arrow */}
      <motion.path
        d="M285 38h20"
        stroke="var(--color-accent-cyan)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      />
      <polygon points="305,33 313,38 305,43" fill="var(--color-accent-cyan)" />

      {/* Dashboard */}
      <g>
        <motion.rect
          x="315" y="16" width="75" height="44" rx="6"
          className="fill-[var(--color-accent-blue)]/10 stroke-[var(--color-accent-blue)]"
          strokeWidth="1.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />
        <text x="352" y="33" textAnchor="middle" className="fill-[var(--color-accent-blue)] text-[8px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          Dashboard
        </text>
        <text x="352" y="43" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          Command Center
        </text>
        <text x="352" y="51" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          14 Plants View
        </text>
      </g>

      {/* Bottom row: factories */}
      <g className="opacity-60">
        {[
          { x: 20, label: 'Plant 01' },
          { x: 100, label: 'Plant 02' },
          { x: 180, label: '···' },
          { x: 260, label: 'Plant 14' },
        ].map((p, i) => (
          <g key={p.label}>
            <motion.rect
              x={p.x} y="80" width="56" height="20" rx="3"
              className="fill-[var(--color-surface-tertiary)] stroke-[var(--color-border)]"
              strokeWidth="1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
            />
            <text x={p.x + 28} y="93" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
              {p.label}
            </text>
            {/* Vertical connector up */}
            <path
              d={`M${p.x + 28} 80 V${70}`}
              stroke="var(--color-border)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </g>
        ))}
      </g>

      {/* Bottom label */}
      <text x="200" y="120" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[7px]">
        Industrial IoT Sensor Network · 14 Connected Plants
      </text>
    </svg>
  )
}

/* ─── Supply Chain: ML → Routes → Tracking ─── */
function SupplyChainArch() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      {/* ML Forecasting */}
      <g>
        <motion.rect
          x="10" y="16" width="90" height="44" rx="6"
          className="fill-[var(--color-accent-purple)]/10 stroke-[var(--color-accent-purple)]"
          strokeWidth="1.5"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        />
        <text x="55" y="33" textAnchor="middle" className="fill-[var(--color-accent-purple)] text-[8px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          ML Forecasting
        </text>
        <text x="55" y="43" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          Prophet + LSTM
        </text>
        <text x="55" y="51" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          94% accuracy
        </text>
      </g>

      {/* Arrow */}
      <motion.path
        d="M100 38h20"
        stroke="var(--color-accent-cyan)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
      <polygon points="120,33 128,38 120,43" fill="var(--color-accent-cyan)" />

      {/* Route Optimizer */}
      <g>
        <motion.rect
          x="130" y="16" width="90" height="44" rx="6"
          className="fill-[var(--color-accent-blue)]/10 stroke-[var(--color-accent-blue)]"
          strokeWidth="1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <text x="175" y="33" textAnchor="middle" className="fill-[var(--color-accent-blue)] text-[8px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          Route Optimizer
        </text>
        <text x="175" y="43" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          Genetic Algorithm
        </text>
        <text x="175" y="51" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          VRPTW Solver
        </text>
      </g>

      {/* Arrow */}
      <motion.path
        d="M220 38h20"
        stroke="var(--color-accent-cyan)"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      />
      <polygon points="240,33 248,38 240,43" fill="var(--color-accent-cyan)" />

      {/* Dispatch */}
      <g>
        <motion.rect
          x="250" y="16" width="70" height="44" rx="6"
          className="fill-[var(--color-accent-emerald)]/10 stroke-[var(--color-accent-emerald)]"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <text x="285" y="33" textAnchor="middle" className="fill-[var(--color-accent-emerald)] text-[8px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          Dispatch
        </text>
        <text x="285" y="43" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          Live Routes
        </text>
        <text x="285" y="51" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[6px]">
          2,400+ Trucks
        </text>
      </g>

      {/* Bottom: live tracking map dots */}
      <g className="opacity-60">
        {/* Route lines */}
        <motion.path
          d="M30 110 Q80 90 130 100 Q180 85 230 95 Q280 80 330 90 Q360 95 370 110"
          className="stroke-[var(--color-accent-blue)]"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
        {/* Destination dots */}
        {[
          { cx: 30, delay: 0.8 },
          { cx: 100, delay: 0.9 },
          { cx: 170, delay: 1.0 },
          { cx: 240, delay: 1.1 },
          { cx: 310, delay: 1.2 },
          { cx: 370, delay: 1.3 },
        ].map((d) => (
          <motion.circle
            key={d.cx}
            cx={d.cx} cy={110} r="3"
            className="fill-[var(--color-accent-cyan)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: d.delay }}
          />
        ))}
      </g>

      <text x="200" y="135" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[7px]">
        Dynamic Route Optimization · 300+ Routes · Pan-India Network
      </text>
    </svg>
  )
}

/* ─── Financial: API Gateway → Microservices → Data ─── */
function FinancialArch() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
      {/* API Gateway */}
      <g>
        <motion.rect
          x="130" y="8" width="140" height="28" rx="14"
          className="fill-[var(--color-accent-purple)]/15 stroke-[var(--color-accent-purple)]"
          strokeWidth="1.5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />
        <text x="200" y="26" textAnchor="middle" className="fill-[var(--color-accent-purple)] text-[9px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          API Gateway · Kong
        </text>
      </g>

      {/* Microservices row */}
      <g>
        {[
          { x: 10, label: 'Auth', w: 56 },
          { x: 76, label: 'Orders', w: 60 },
          { x: 146, label: 'Accounts', w: 64 },
          { x: 220, label: 'Reports', w: 58 },
          { x: 288, label: 'Audit', w: 54 },
          { x: 352, label: 'KYC', w: 44 },
        ].map((svc, i) => (
          <g key={svc.label}>
            <motion.rect
              x={svc.x} y="56" width={svc.w} height="32" rx="4"
              className="fill-[var(--color-accent-blue)]/10 stroke-[var(--color-accent-blue)]/40"
              strokeWidth="1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            />
            <text x={svc.x + svc.w / 2} y="75" textAnchor="middle" className="fill-[var(--color-accent-blue)] text-[7px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
              {svc.label}
            </text>
            {/* Down arrows from API gateway */}
            <motion.path
              d={`M${svc.x + svc.w / 2} 36 V52`}
              stroke="var(--color-border)"
              strokeWidth="1"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
            />
          </g>
        ))}
      </g>

      {/* Data layer */}
      <g className="opacity-60">
        <motion.rect
          x="60" y="108" width="120" height="24" rx="4"
          className="fill-[var(--color-accent-emerald)]/10 stroke-[var(--color-accent-emerald)]/40"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        />
        <text x="120" y="124" textAnchor="middle" className="fill-[var(--color-accent-emerald)] text-[7px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          Aurora PostgreSQL · Multi-AZ
        </text>

        <motion.rect
          x="220" y="108" width="120" height="24" rx="4"
          className="fill-[var(--color-accent-cyan)]/10 stroke-[var(--color-accent-cyan)]/40"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        />
        <text x="280" y="124" textAnchor="middle" className="fill-[var(--color-accent-cyan)] text-[7px] font-semibold" style={{ fontFamily: 'var(--font-mono)' }}>
          ElastiCache Redis
        </text>

        {/* Connectors up */}
        {[
          { x1: 120, x2: 80, x3: 120, fromX: 120 },
          { x1: 280, x2: 280, x3: 280, fromX: 280 },
        ].map((conn, i) => (
          <motion.path
            key={i}
            d={`M${conn.fromX} 88 V104`}
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="2 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1.1 }}
          />
        ))}
      </g>

      {/* Uptime badge */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <rect x="155" y="152" width="90" height="20" rx="10" className="fill-[var(--color-accent-emerald)]/15" stroke="none" />
        <text x="200" y="165" textAnchor="middle" className="fill-[var(--color-accent-emerald)] text-[8px] font-bold" style={{ fontFamily: 'var(--font-mono)' }}>
          99.99% Uptime
        </text>
      </motion.g>

      <text x="200" y="190" textAnchor="middle" className="fill-[var(--color-text-tertiary)] text-[7px]">
        23 Microservices · Amazon EKS · Terraform · GitOps
      </text>
    </svg>
  )
}

export function ArchDiagram({ type, className }: ArchDiagramProps) {
  const prefersReducedMotion = useReducedMotion()

  const diagram = (() => {
    switch (type) {
      case 'manufacturing':
        return <ManufacturingArch />
      case 'supply-chain':
        return <SupplyChainArch />
      case 'financial':
        return <FinancialArch />
    }
  })()

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        {diagram}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {diagram}
    </motion.div>
  )
}
