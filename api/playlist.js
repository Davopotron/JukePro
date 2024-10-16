const express = require("express")
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
    try {
        const playlists = await prisma.playlists.findMany({
            where: { tracks: req.track.id },
            include: { user: true },
        });
        res.json(playlists);

    }
});