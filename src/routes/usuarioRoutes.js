import express from "express";
import { checkAuth } from "../middleware/atuthenticar.js";
import {
    authenticar,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    listarUsuarios
    

} from "../controller/usuarioController.js";


const router = express.Router()

router.get("/", listarUsuarios)
router.post("/", registrar)
router.post("/login", authenticar)
router.get("/confirmar/:token", confirmar)
router.post("/reset-password", resetPassword)
router.route("/reset-password/:token").get(comprobarToken).post(nuevoPassword)

router.get("/perfil", checkAuth, perfil)

export default router