import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Store, ArrowRight, ArrowLeft, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import FormField, { inputClassName } from '@/shared/ui/FormField/FormField';
import { ALLOWED_DOMAIN } from '@/shared/constants/app';
import fieldStyles from '@/shared/ui/FormField/FormField.module.css';
import s from './StepInput.module.css';

const springTransition = { type: 'spring', stiffness: 100, damping: 15 };

const container = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: springTransition },
};

export default function StepInput({ initialUrl, initialShop, onBack, onNext }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState(initialUrl);
  const [shop, setShop] = useState(initialShop);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!url || !url.includes(ALLOWED_DOMAIN)) {
      nextErrors.url = 'input.errors.url';
    }
    if (!shop || shop.trim().length < 2) {
      nextErrors.shop = 'input.errors.shop';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onNext(url.trim(), shop);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={s.root}
      variants={container}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={fadeUp} className={s.headerRow}>
        <div>
          <div className={s.stepBadge}>
            <ClipboardList size={12} />
            {t('input.badge')}
          </div>
          <h2 className={s.title}>{t('input.title')}</h2>
          <p className={s.subtitle}>{t('input.subtitle')}</p>
        </div>
        <button type="button" onClick={onBack} className={s.btnBackDesktop}>
          <ArrowLeft size={16} />
          {t('input.back')}
        </button>
      </motion.div>

      <motion.div variants={fadeUp} className={s.grid}>
        <FormField
          label={t('input.productLabel')}
          icon={<Search className={fieldStyles.icon} size={18} />}
          error={errors.url ? t(errors.url) : null}
        >
          <input
            type="text"
            placeholder={t('input.productPlaceholder')}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={inputClassName(!!errors.url)}
          />
        </FormField>

        <FormField
          label={t('input.shopLabel')}
          icon={<Store className={fieldStyles.icon} size={18} />}
          error={errors.shop ? t(errors.shop) : null}
        >
          <input
            type="text"
            placeholder={t('input.shopPlaceholder')}
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className={inputClassName(!!errors.shop)}
          />
        </FormField>
      </motion.div>

      <motion.div variants={fadeUp} className={s.footer}>
        <button type="button" onClick={onBack} className={s.btnBackMobile}>
          <ArrowLeft size={16} />
          {t('input.back')}
        </button>
        <motion.button
          type="submit"
          className={s.btnSubmit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>{t('input.continue')}</span>
          <ArrowRight size={18} className={s.btnSubmitArrow} />
        </motion.button>
      </motion.div>
    </motion.form>
  );
}
