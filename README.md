# eda-microservices
Simple implementation of an event driven architecture with RabbitMQ.

# Starting
- Start the back-end for front-end API: `cd front-end/ && yarn run start:dev"
- Open another console and start the `main_worker.js` (main worker)
- Open another console and start the `inventory-worker-error-success.js`: `node inventory-service/inventory-worker-error-success.js` (success worker for inventory service)
- Open another console and start the `inventory-worker-error-success.js`: `node inventory-service/inventory-worker-error-error.js` (error worker for inventory service)
- Open another console and start the `inventory-worker-error-success.js`: `node inventory-service/billing-worker.js` 
- On the root folder, open antoher console and run `docker-compose up -d`


# Runninng scenarios
- Access `http://localhost:5000` and send a request to `POST /orders` `reject` property set to null (see it works just fine)
- Access `http://localhost:5000` and send a request to `POST /orders` `reject` property set to `inventory.order.rejected` (see that the order's been rejected by inventory service)
- Access `http://localhost:5000` and send a request to `POST /orders` `reject` property set to `billing.order.rejected` (simulates the order's been rejected by billing service)

# References
- [messaging-patterns-for-event-driven-microservices](http://www.myspsolution.com/news-events/messaging-patterns-for-event-driven-microservices/)
- [Mensageria e eventos](https://github.com/caelum/apostila-microservices-com-spring-cloud/blob/master/10-mensageria-e-eventos.md)
