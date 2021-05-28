import amqp from "amqp-connection-manager";
import logger from "@fonos/logger";

export default class RabbitQConnector {
  address: string[];
  channelWrapper: any;
  q: string;
  constructor(address: string[], q: string) {
    this.address = address;
    this.q = q;
  }

  connect() {
    if (process.env.EVENTS_ENABLED !== "true") {
      logger.info("@fonos/events rabbitq connector [disabled]");
      return;
    }
    logger.info("@fonos/events rabbitq connector [connecting to rabbitq]");
    const connection = amqp.connect(this.address);
    this.channelWrapper = connection.createChannel({
      json: true,
      setup: (channel: any) => {
        logger.info(
          `@fonos/events rabbitq connector [setting up q => ${this.q}, durable => false]`
        );
        return channel.assertQueue(this.q, {durable: false});
      }
    });
  }
}
