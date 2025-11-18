const cron = require('node-cron');
const fcmService = require('./fcmService');
const logger = require('../utils/logger');

class PromotionalScheduler {
  constructor() {
    this.scheduledJobs = [];
    this.isRunning = false;
  }

  /**
   * Start all promotional notification schedulers
   */
  start() {
    if (this.isRunning) {
      logger.warn('Promotional scheduler is already running');
      return;
    }

    logger.info('🚀 Starting promotional notification scheduler...');

    // Schedule 1: Morning promotional notifications (9 AM daily)
    const morningPromo = cron.schedule('0 9 * * *', async () => {
      logger.info('⏰ Sending morning promotional notifications...');
      try {
        const promo = fcmService.getRandomPromotionalMessage();
        await fcmService.sendPromotionalNotification(
          promo.title,
          promo.body,
          'morning_promo'
        );
      } catch (error) {
        logger.error('Error sending morning promo:', error.message);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    // Schedule 2: Afternoon flash sale (2 PM daily)
    const afternoonPromo = cron.schedule('0 14 * * *', async () => {
      logger.info('⏰ Sending afternoon flash sale notifications...');
      try {
        await fcmService.sendPromotionalNotification(
          '⚡ Afternoon Flash Sale — 60% OFF!',
          'Limited time offer! Grab your favorites at amazing discounts. Ends in 4 hours!',
          'flash_sale'
        );
      } catch (error) {
        logger.error('Error sending afternoon promo:', error.message);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    // Schedule 3: Evening deals (6 PM daily)
    const eveningPromo = cron.schedule('0 18 * * *', async () => {
      logger.info('⏰ Sending evening deal notifications...');
      try {
        const promo = fcmService.getRandomPromotionalMessage();
        await fcmService.sendPromotionalNotification(
          promo.title,
          promo.body,
          'evening_deals'
        );
      } catch (error) {
        logger.error('Error sending evening promo:', error.message);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    // Schedule 4: Weekend special (Saturday & Sunday at 11 AM)
    const weekendPromo = cron.schedule('0 11 * * 6,0', async () => {
      logger.info('⏰ Sending weekend special notifications...');
      try {
        await fcmService.sendPromotionalNotification(
          '🎉 Weekend Bonanza — Extra 25% OFF!',
          'It\'s the weekend! Treat yourself with our special weekend offers. Shop now!',
          'weekend_special'
        );
      } catch (error) {
        logger.error('Error sending weekend promo:', error.message);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    // Schedule 5: Midnight sale (12 AM daily)
    const midnightPromo = cron.schedule('0 0 * * *', async () => {
      logger.info('⏰ Sending midnight sale notifications...');
      try {
        await fcmService.sendPromotionalNotification(
          '🌙 Midnight Madness — 50% OFF Everything!',
          'Can\'t sleep? Shop now and grab insane midnight deals. Limited time only!',
          'midnight_sale'
        );
      } catch (error) {
        logger.error('Error sending midnight promo:', error.message);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    // Schedule 6: Random promotional notifications every 4 hours
    const randomPromo = cron.schedule('0 */4 * * *', async () => {
      logger.info('⏰ Sending random promotional notification...');
      try {
        const promo = fcmService.getRandomPromotionalMessage();
        await fcmService.sendPromotionalNotification(
          promo.title,
          promo.body,
          'random_promo'
        );
      } catch (error) {
        logger.error('Error sending random promo:', error.message);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Kolkata"
    });

    this.scheduledJobs = [
      morningPromo,
      afternoonPromo,
      eveningPromo,
      weekendPromo,
      midnightPromo,
      randomPromo
    ];

    this.isRunning = true;
    logger.info('✅ Promotional scheduler started successfully with 6 scheduled jobs');
  }

  /**
   * Stop all promotional schedulers
   */
  stop() {
    if (!this.isRunning) {
      logger.warn('Promotional scheduler is not running');
      return;
    }

    logger.info('⏹️ Stopping promotional notification scheduler...');
    
    this.scheduledJobs.forEach(job => {
      job.stop();
    });

    this.scheduledJobs = [];
    this.isRunning = false;
    
    logger.info('✅ Promotional scheduler stopped successfully');
  }

  /**
   * Send promotional notification immediately
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {string} promoType - Type of promotion
   */
  async sendNow(title, body, promoType = 'manual') {
    try {
      logger.info('📢 Sending immediate promotional notification...');
      const result = await fcmService.sendPromotionalNotification(title, body, promoType);
      logger.info('✅ Promotional notification sent successfully');
      return result;
    } catch (error) {
      logger.error('Error sending promotional notification:', error.message);
      throw error;
    }
  }

  /**
   * Send random promotional notification now
   */
  async sendRandomNow() {
    const promo = fcmService.getRandomPromotionalMessage();
    return await this.sendNow(promo.title, promo.body, 'manual_random');
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: this.scheduledJobs.length,
      jobs: [
        { name: 'Morning Promo', schedule: '9 AM daily', status: this.isRunning ? 'active' : 'stopped' },
        { name: 'Afternoon Flash Sale', schedule: '2 PM daily', status: this.isRunning ? 'active' : 'stopped' },
        { name: 'Evening Deals', schedule: '6 PM daily', status: this.isRunning ? 'active' : 'stopped' },
        { name: 'Weekend Special', schedule: '11 AM Sat & Sun', status: this.isRunning ? 'active' : 'stopped' },
        { name: 'Midnight Sale', schedule: '12 AM daily', status: this.isRunning ? 'active' : 'stopped' },
        { name: 'Random Promo', schedule: 'Every 4 hours', status: this.isRunning ? 'active' : 'stopped' }
      ]
    };
  }
}

module.exports = new PromotionalScheduler();
