import type { NextApiRequest, NextApiResponse } from "next";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.body;

    try {
        const response = await fetch(
            process.env.RACEASSIST_API_SERVER_URL + "/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }
        );
        const status = response.status;
        console.log("status: " + status);

        if (status === 200) {
            const data = await response.json();
            res.status(200).json(data);
        } else {
            const data = await response.text();
            res.status(status).send(data);
            console.log("data: " + data);
        }
        
    } catch (error) {
        console.log(error);
        res.status(504).send(error);
    }
};

export default login;
