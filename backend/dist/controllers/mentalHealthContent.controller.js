"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActive = exports.toggleStatus = exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const service = __importStar(require("../services/mentalHealthContent.service"));
const getAll = async (req, res) => {
    const data = await service.getAllContent();
    res.json(data);
};
exports.getAll = getAll;
const getOne = async (req, res) => {
    const id = Number(req.params.id);
    const data = await service.getContentById(id);
    res.json(data);
};
exports.getOne = getOne;
const create = async (req, res) => {
    const data = await service.createContent({
        ...req.body,
        createdBy: req.user.id, // si tu utilises un middleware auth
    });
    res.json(data);
};
exports.create = create;
const update = async (req, res) => {
    const id = Number(req.params.id);
    const data = await service.updateContent(id, req.body);
    res.json(data);
};
exports.update = update;
const remove = async (req, res) => {
    const id = Number(req.params.id);
    await service.deleteContent(id);
    res.json({ success: true });
};
exports.remove = remove;
const toggleStatus = async (req, res) => {
    const id = Number(req.params.id);
    const updated = await service.toggleContentStatus(id);
    if (!updated)
        return res.status(404).json({ error: "Content not found" });
    res.json(updated);
};
exports.toggleStatus = toggleStatus;
const getActive = async (req, res) => {
    const data = await service.getActiveContent();
    res.json(data);
};
exports.getActive = getActive;
