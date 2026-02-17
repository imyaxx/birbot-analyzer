import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import s from './StepWelcome.module.css';

const springTransition = { type: 'spring', stiffness: 100, damping: 15 };

const container = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: springTransition },
};

const FLOATING_ICONS = [
  { Icon: TrendingUp, size: 28, className: 'floatIcon1' },
  { Icon: BarChart3, size: 24, className: 'floatIcon2' },
  { Icon: Target, size: 22, className: 'floatIcon3' },
  { Icon: Zap, size: 20, className: 'floatIcon4' },
  { Icon: ShieldCheck, size: 26, className: 'floatIcon5' },
];

function HeroVisual() {
  return (
    <div className={s.heroVisual}>
      <div className={s.dotGrid} />

      <motion.div
        className={s.ring2}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />
      <motion.div
        className={s.ring1}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      />

      <motion.div
        className={s.orb}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.3 }}
      >
        <motion.div
          className={s.orbInner}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <div className={s.orbCenter}>
          <TrendingUp size={32} strokeWidth={2} />
        </div>
      </motion.div>

      {FLOATING_ICONS.map(({ Icon, size, className }, i) => (
        <motion.div
          key={className}
          className={`${s.floatIcon} ${s[className]}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8 - i * 2, 0],
          }}
          transition={{
            opacity: { delay: 0.5 + i * 0.1, ...springTransition },
            scale: { delay: 0.5 + i * 0.1, ...springTransition },
            y: {
              duration: 3 + i * 0.5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: 0.5 + i * 0.1 + i * 0.3,
            },
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}
    </div>
  );
}

function FeatureHighlights({ t }) {
  const features = [
    { icon: TrendingUp, textKey: 'welcome.feature1' },
    { icon: Clock, textKey: 'welcome.feature2' },
    { icon: Zap, textKey: 'welcome.feature3' },
  ];

  return (
    <div className={s.features}>
      {features.map(({ icon: FeatureIcon, textKey }, i) => (
        <motion.div
          key={textKey}
          className={s.featureItem}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.08, ...springTransition }}
        >
          <div className={s.featureIconWrap}>
            <FeatureIcon size={16} strokeWidth={2} />
          </div>
          <span className={s.featureText}>{t(textKey)}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function StepWelcome({ onNext }) {
  const { t } = useTranslation();

  return (
    <div className={s.root}>
      <div className={s.grid}>
        <motion.div
          className={s.content}
          variants={container}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp} className={s.badge}>
            <Sparkles size={14} />
            {t('welcome.badge')}
          </motion.div>

          <motion.h1 variants={fadeUp} className={s.title}>
            {t('welcome.titleBefore')}
            <span className={s.titleAccent}>{t('welcome.titleHighlight')}</span>
            {t('welcome.titleAfter', { defaultValue: '' })}
          </motion.h1>

          <motion.p variants={fadeUp} className={s.subtitle}>
            {t('welcome.subtitle')}
          </motion.p>

          <motion.div variants={fadeUp}>
            <FeatureHighlights t={t} />
          </motion.div>

          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className={s.ctaBtn}
          >
            <span>{t('welcome.cta')}</span>
            <ArrowRight size={18} className={s.ctaArrow} />
          </motion.button>
        </motion.div>

        <HeroVisual />
      </div>
    </div>
  );
}
