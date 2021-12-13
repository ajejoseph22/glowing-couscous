import { Request, Response } from "express";
import { errorResponse } from "../utils/methods";
import data from "../data.json";

export default (req: Request, res: Response) => {
  try {
    // todo: use right type here
    const refined: Record<string, any> = {};
    const consolidatedTeams: Record<string, any> = {};
    const managers: Record<string, any> = {};
    const s_managers: Record<string, any> = {};

    Object.keys(data).forEach((userId) => {
      // todo: use right type here
      managers[userId] = (data as Record<string, any>)[userId].manager.reduce(
        (acc: Record<string, any>, item: string) => {
          acc[item] = true;
          return acc;
        },
        {}
      );

      s_managers[userId] = (data as Record<string, any>)[
        userId
      ].s_manager.reduce((acc: Record<string, any>, item: string) => {
        acc[item] = true;
        return acc;
      }, {});
    });

    Object.keys(data).forEach((userId) => {
      // todo: use right type here
      const teams = (data as Record<string, any>)[userId].teams;

      s_managers[userId] = (data as Record<string, any>)[
        userId
      ].s_manager.reduce((acc: Record<string, any>, item: string) => {
        acc[item] = true;
        return acc;
      }, {});

      Object.keys(teams || {}).forEach((teamId) => {
        const teamSettings = teams[teamId].settings;
        const channelId = teamSettings?.channel_id;

        if (teamSettings.channel_id) {
          refined[channelId] = [
            {
              name: `${userId}&${teamId}`,
              attributes: {
                isPrimary: true,
                "manager(s)":
                  Object.keys(managers)
                    .reduce((acc: string[], item) => {
                      if (`${userId}&${teamId}` === "UQ3QMNZ4M&0") debugger;
                      if (
                        managers[item].hasOwnProperty(`${userId}&${teamId}`) ||
                        item === userId
                      ) {
                        acc.push((data as Record<string, any>)[item].realName);
                      }

                      return acc;
                    }, [])
                    .join(", ") || "none",
                "s_manager(s)":
                  Object.keys(s_managers)
                    .reduce((acc: string[], item) => {
                      if (
                        s_managers[item].hasOwnProperty(`${userId}&${teamId}`)
                      ) {
                        acc.push((data as Record<string, any>)[item].realName);
                      }

                      return acc;
                    }, [])
                    .join(", ") || "none",
              },
              directs: teams[teamId].directs,
            },
          ];

          if (teams[teamId].settings.consolidatedTeams) {
            refined[channelId] = refined[channelId].concat(
              teams[teamId].settings.consolidatedTeams.map(
                (teamIdentifier: string[]) => ({
                  name: teamIdentifier,
                  attributes: {
                    isPrimary: false,
                    "manager(s)":
                      Object.keys(managers)
                        .reduce((acc: string[], item) => {
                          if (
                            managers[item].hasOwnProperty(`${userId}&${teamId}`)
                          ) {
                            acc.push(
                              (data as Record<string, any>)[item].realName
                            );
                          }

                          return acc;
                        }, [])
                        .join(", ") || "none",
                    "s_manager(s)":
                      Object.keys(s_managers)
                        .reduce((acc: string[], item) => {
                          if (
                            s_managers[item].hasOwnProperty(
                              `${userId}&${teamId}`
                            )
                          ) {
                            acc.push(
                              (data as Record<string, any>)[item].realName
                            );
                          }

                          return acc;
                        }, [])
                        .join(", ") || "none",
                  },
                  directs: teams[teamId].directs,
                })
              )
            );
          }
        }

        if (teamSettings.consolidatedPrimaryTeam) {
          if (!consolidatedTeams[teamSettings.consolidatedPrimaryTeam]) {
            consolidatedTeams[teamSettings.consolidatedPrimaryTeam] = {};
          }

          consolidatedTeams[teamSettings.consolidatedPrimaryTeam][
            `${userId}&${teamId}`
          ] = {};
        }
      });
    });

    const processedData = Object.keys(refined).map((channelId) => {
      return {
        name: `Channel ${channelId}`,
        children: refined[channelId].map((teamObj: Record<string, any>) => {
          const [userId, teamId] = teamObj.name.split("&");

          return {
            name: (data as Record<string, any>)[userId].teams[teamId].name,
            attributes: teamObj.attributes,
            children: teamObj.directs.map((userId: string) => {
              return {
                name: (data as Record<string, any>)[userId]
                  ? (data as Record<string, any>)[userId].realName
                  : userId,
              };
            }),
          };
        }),
      };
    });

    res.json({
      name: "Organization",
      children: processedData,
    });
  } catch ({ message }) {
    res.status(400).json(errorResponse(""));
  }
};
