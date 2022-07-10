import  express,{request, response } from "express";
import { checkAuth } from "../middleware/atuthenticar.js";

const router = express.Router()
import {
    authenticar,
    registrar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    listarUsuarios,
    obtenerUsuario
    

} from "../controller/usuarioController.js";




router.get("/", checkAuth, listarUsuarios)
router.post("/", registrar)
router.post("/login", authenticar)
router.get("/confirmar-cuenta/:token", confirmar)
router.post("/olvide-password", olvidePassword)
router.route("/nuevo-password/:token").get(comprobarToken).post(nuevoPassword)
router.get('/:id', obtenerUsuario)

router.get("/perfil/ok", checkAuth, perfil)

export default router