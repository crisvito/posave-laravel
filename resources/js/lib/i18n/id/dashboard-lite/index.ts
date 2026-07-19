import { dashboard } from './dashboard';
import { inventoryAdjustments } from './inventory-adjustments';
import { inventoryCategories } from './inventory-categories';
import { inventoryItems } from './inventory-items';
import { order } from './order';
import { profile } from './profile';
import { receipt } from './receipt';
import sidebar from './sidebar';

const dashboardLite = { sidebar, profile, receipt, order, history, inventoryItems, inventoryCategories, inventoryAdjustments, dashboard };

export default dashboardLite;