import { logger } from "../tools";
import partiesArr from "./parties";

export default class Parties {
  constructor(jetset, database) {
    this.jetset = jetset;
    this.database = database;
  }
  defaultRoute(req, res) {
    res.end("server listening...index");
  }

  addParties(req, res) {
    let party = req.body || {};
    logger.info("*** add parties req", party);
    res.json(party);
  }

  updateParties(req, res) {
    let party = req.body || {};
    logger.info("*** edit parties");
    res.json(party);
  }

  deleteParties(req, res) {
    let party = req.body || {};
    logger.info("*** Delete parties");
    res.json(party);
  }

  getParties(request, response) {
    let data = partiesArr;

    request.on("data", chunk => {
      data += chunk;
    });

    request.on("end", () => {
      console.log("dat:", data);
      let person = data;


      if (person.email === undefined) {
        response.setHeader("Content-Type", "application/json");
        response.status(400);
        response.send(
          JSON.stringify({
            error: "missing email address"
          })
        );

        return;
      }

      this.jetset
        .Authenticate()
        .then(token => {
          this.database
            .GetPartyByEmailAddress(person.email)
            .then(result => {
              if (result === null || result.length === 0) {
                response.setHeader("Content-Type", "application/json");
                response.status(404);
                response.send(
                  JSON.stringify({
                    error: "can not find party"
                  })
                );

                return;
              }

              this.jetset
                .GetParty(token, result[0].jetset_id)
                .then(person => {
                  response.setHeader("Content-Type", "application/json");
                  response.send(JSON.stringify(person));
                })
                .catch(error => {
                  response.setHeader("Content-Type", "application/json");
                  response.status(500);
                  response.send(
                    JSON.stringify({
                      error: error
                    })
                  );
                });
            })
            .catch(error => {
              response.setHeader("Content-Type", "application/json");
              response.status(500);
              response.send(
                JSON.stringify({
                  error: error
                })
              );
            });
        })
        .catch(() => {
          response.setHeader("Content-Type", "application/json");
          response.status(500);
          response.send(
            JSON.stringify({
              error: "unable to authenticate against Jetset"
            })
          );
        });
    });
  }

  createParty(request, response) {
    this.jetset
      .Authenticate()
      .then(token => {
        let body = "";

        request.on("data", chunk => {
          body += chunk;
        });

        request.on("end", () => {
          let party = JSON.parse(body);
          this.jetset
            .CreateParty(token, party)
            .then(person => {
              let dbParty = {
                jetset_id: person.id,
                title: person.title,
                first_name: person.firstName,
                last_name: person.lastName,
                dob: person.dob,
                email: person.email,
                created: new Date()
              };

              this.database
                .InsertParty(dbParty)
                .then(result => {
                  logger.info("DB result" + result);
                  response.setHeader("Content-Type", "application/json");
                  response.send(JSON.stringify(dbParty));
                })
                .catch(error => {
                  response.setHeader("Content-Type", "application/json");
                  response.status(500);
                  response.send(
                    JSON.stringify({
                      error: error
                    })
                  );
                });
            })
            .catch(error => {
              response.setHeader("Content-Type", "application/json");
              response.status(500);
              response.send(
                JSON.stringify({
                  error: error
                })
              );
            });
        });
      })
      .catch(() => {
        logger.error(new Date(), "error authenticating against jetset");
        response.setHeader("Content-Type", "application/json");
        response.status(500);
        response.send(
          JSON.stringify({
            error: "unable to authenticate against Jetset"
          })
        );
      });
  }
}
