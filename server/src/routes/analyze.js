/**
 * Роут POST /api/analyze
 * Принимает ссылку на товар Kaspi + название магазина,
 * возвращает результат анализа (позиция, цена лидера, разница цен).
 */
import express from 'express';
import { analyzeKaspiProduct } from '../services/kaspiParser.js';

const router = express.Router();

/** Безопасно парсит URL; возвращает null при невалидной ссылке */
function parseUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return {
      host: parsed.host,
    };
  } catch (error) {
    return null;
  }
}

router.post('/', async (req, res) => {
  try {
    const productUrl = String(req.body.productUrl ?? '').trim();
    const shopName = String(req.body.shopName ?? '').trim();

    if (!productUrl) {
      return res.status(400).json({ message: 'Введите ссылку на товар' });
    }

    const parsed = parseUrl(productUrl);
    if (!parsed) {
      return res.status(400).json({ message: 'Некорректная ссылка' });
    }

    if (!parsed.host.endsWith('kaspi.kz')) {
      return res
        .status(400)
        .json({ message: 'Платформа не поддерживается. Вставьте ссылку на товар Kaspi.' });
    }

    if (!shopName || shopName.length < 2) {
      return res.status(400).json({ message: 'Введите название магазина' });
    }

    const result = await analyzeKaspiProduct(productUrl, shopName);

    if (!result.myShopFound) {
      return res.status(404).json({ message: 'Указанный магазин не найден среди продавцов' });
    }

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Не удалось выполнить анализ' });
  }
});

export default router;
