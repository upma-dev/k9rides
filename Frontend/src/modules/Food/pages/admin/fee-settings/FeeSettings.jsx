import { useState, useEffect } from "react"
import { Save, Loader2, DollarSign, Plus, Trash2, Pencil, Check, X } from "lucide-react"
import { Button } from "@food/components/ui/button"
import { adminAPI } from "@food/api"
import { toast } from "sonner"

const debugError = (..._args) => {}

export default function FeeSettings() {
  const [feeSettings, setFeeSettings] = useState({
    deliveryFee: "",
    deliveryFeeRanges: [],
    deliveryFeeComputationMode: "distance_order_value",
    distanceOrderDeliveryFeeRules: [],
    distanceSlabAdminDeliveryCommission: [],
    freeDeliveryThreshold: "",
    platformFee: "",
    gstRate: "",
  })
  const [distanceRules, setDistanceRules] = useState([])
  const [newPriceSlabByRule, setNewPriceSlabByRule] = useState({})
  const [editingPriceSlabByRule, setEditingPriceSlabByRule] = useState({})
  const [loadingFeeSettings, setLoadingFeeSettings] = useState(false)
  const [savingFeeSettings, setSavingFeeSettings] = useState(false)

  const getDistanceRuleConfig = (ruleId) =>
    feeSettings.distanceOrderDeliveryFeeRules.find((r) => String(r.distanceRuleId) === String(ruleId)) || null

  const getDistanceRuleAdminCommissionConfig = (ruleId) =>
    feeSettings.distanceSlabAdminDeliveryCommission.find((r) => String(r.distanceRuleId) === String(ruleId)) || null

  const setDistanceRuleConfig = (ruleId, updater) => {
    const prev = feeSettings.distanceOrderDeliveryFeeRules
    const idx = prev.findIndex((r) => String(r.distanceRuleId) === String(ruleId))
    const next = [...prev]
    if (idx === -1) {
      next.push(updater({ distanceRuleId: String(ruleId), priceSlabs: [] }))
    } else {
      next[idx] = updater(next[idx])
    }
    setFeeSettings({ ...feeSettings, distanceOrderDeliveryFeeRules: next })
  }

  const setDistanceRuleAdminCommissionConfig = (ruleId, updater) => {
    const prev = feeSettings.distanceSlabAdminDeliveryCommission
    const idx = prev.findIndex((r) => String(r.distanceRuleId) === String(ruleId))
    const next = [...prev]
    if (idx === -1) {
      next.push(updater({ distanceRuleId: String(ruleId), isEnabled: false, adminDeliveryCommissionPercent: 0 }))
    } else {
      next[idx] = updater(next[idx])
    }
    setFeeSettings({ ...feeSettings, distanceSlabAdminDeliveryCommission: next })
  }

  const fetchFeeSettings = async () => {
    try {
      setLoadingFeeSettings(true)
      const response = await adminAPI.getFeeSettings()
      const saved = response?.data?.data?.feeSettings
      if (response?.data?.success && saved) {
        setFeeSettings({
          deliveryFee: saved.deliveryFee ?? "",
          deliveryFeeRanges: saved.deliveryFeeRanges || [],
          deliveryFeeComputationMode: saved.deliveryFeeComputationMode || "distance_order_value",
          distanceOrderDeliveryFeeRules: saved.distanceOrderDeliveryFeeRules || [],
          distanceSlabAdminDeliveryCommission: saved.distanceSlabAdminDeliveryCommission || [],
          freeDeliveryThreshold: saved.freeDeliveryThreshold ?? "",
          platformFee: saved.platformFee ?? "",
          gstRate: saved.gstRate ?? "",
        })
      }
      if (response?.data?.success && saved === null) {
        setFeeSettings({
          deliveryFee: "",
          deliveryFeeRanges: [],
          deliveryFeeComputationMode: "distance_order_value",
          distanceOrderDeliveryFeeRules: [],
          distanceSlabAdminDeliveryCommission: [],
          freeDeliveryThreshold: "",
          platformFee: "",
          gstRate: "",
        })
      }
    } catch (error) {
      debugError(error)
      toast.error("Failed to load fee settings")
    } finally {
      setLoadingFeeSettings(false)
    }
  }

  const fetchDistanceRules = async () => {
    try {
      const response = await adminAPI.getCommissionRules()
      const rows = response?.data?.data?.commissions || []
      setDistanceRules(Array.isArray(rows) ? rows : [])
    } catch (error) {
      debugError(error)
      setDistanceRules([])
      toast.error("Failed to load distance slabs from Delivery Boy Commission")
    }
  }

  useEffect(() => {
    fetchFeeSettings()
    fetchDistanceRules()
  }, [])

  const handleSaveFeeSettings = async () => {
    try {
      const invalidCommission = (feeSettings.distanceSlabAdminDeliveryCommission || []).find((row) =>
        row?.isEnabled === true &&
        (!Number.isFinite(Number(row?.adminDeliveryCommissionPercent)) ||
          Number(row?.adminDeliveryCommissionPercent) < 0 ||
          Number(row?.adminDeliveryCommissionPercent) > 100)
      )
      if (invalidCommission) {
        toast.error("Admin delivery commission must be between 0 and 100")
        return
      }
      setSavingFeeSettings(true)
      const response = await adminAPI.createOrUpdateFeeSettings({
        deliveryFee: feeSettings.deliveryFee === "" ? undefined : Number(feeSettings.deliveryFee),
        deliveryFeeRanges: feeSettings.deliveryFeeRanges,
        deliveryFeeComputationMode: "distance_order_value",
        distanceOrderDeliveryFeeRules: feeSettings.distanceOrderDeliveryFeeRules,
        distanceSlabAdminDeliveryCommission: feeSettings.distanceSlabAdminDeliveryCommission,
        freeDeliveryThreshold: feeSettings.freeDeliveryThreshold === "" ? undefined : Number(feeSettings.freeDeliveryThreshold),
        platformFee: feeSettings.platformFee === "" ? undefined : Number(feeSettings.platformFee),
        gstRate: feeSettings.gstRate === "" ? undefined : Number(feeSettings.gstRate),
        isActive: true,
      })
      if (response?.data?.success) {
        toast.success("Fee settings saved successfully")
        await fetchFeeSettings()
      } else {
        toast.error(response?.data?.message || "Failed to save fee settings")
      }
    } catch (error) {
      debugError(error)
      toast.error(error?.response?.data?.message || "Failed to save fee settings")
    } finally {
      setSavingFeeSettings(false)
    }
  }

  const handleAddPriceSlab = (ruleId) => {
    const form = newPriceSlabByRule[String(ruleId)] || {}
    const minOrderValue = Number(form.minOrderValue)
    const maxOrderValue = Number(form.maxOrderValue)
    const deliveryFee = Number(form.deliveryFee)
    if (!Number.isFinite(minOrderValue) || !Number.isFinite(maxOrderValue) || !Number.isFinite(deliveryFee)) {
      toast.error("Fill all slab fields")
      return
    }
    if (minOrderValue < 0 || maxOrderValue < 0 || deliveryFee < 0) {
      toast.error("Values must be 0 or greater")
      return
    }
    if (minOrderValue >= maxOrderValue) {
      toast.error("Min order value must be less than max order value")
      return
    }
    const existing = getDistanceRuleConfig(ruleId)?.priceSlabs || []
    const overlap = existing.some((s) =>
      (minOrderValue >= s.minOrderValue && minOrderValue < s.maxOrderValue) ||
      (maxOrderValue > s.minOrderValue && maxOrderValue <= s.maxOrderValue) ||
      (minOrderValue <= s.minOrderValue && maxOrderValue >= s.maxOrderValue)
    )
    if (overlap) {
      toast.error("This price slab overlaps with an existing slab")
      return
    }
    setDistanceRuleConfig(ruleId, (cfg) => ({
      ...cfg,
      priceSlabs: [...(cfg.priceSlabs || []), { minOrderValue, maxOrderValue, deliveryFee, isActive: true }]
        .sort((a, b) => a.minOrderValue - b.minOrderValue),
    }))
    setNewPriceSlabByRule((prev) => ({
      ...prev,
      [String(ruleId)]: { minOrderValue: "", maxOrderValue: "", deliveryFee: "" },
    }))
  }

  const handleDeletePriceSlab = (ruleId, index) => {
    setDistanceRuleConfig(ruleId, (cfg) => ({
      ...cfg,
      priceSlabs: (cfg.priceSlabs || []).filter((_, i) => i !== index),
    }))
  }

  const handleStartEditPriceSlab = (ruleId, index, slab) => {
    setEditingPriceSlabByRule((prev) => ({
      ...prev,
      [String(ruleId)]: {
        index,
        minOrderValue: String(slab.minOrderValue),
        maxOrderValue: String(slab.maxOrderValue),
        deliveryFee: String(slab.deliveryFee),
      },
    }))
  }

  const handleCancelEditPriceSlab = (ruleId) => {
    setEditingPriceSlabByRule((prev) => {
      const next = { ...prev }
      delete next[String(ruleId)]
      return next
    })
  }

  const handleSaveEditPriceSlab = (ruleId) => {
    const edit = editingPriceSlabByRule[String(ruleId)]
    if (!edit) return

    const minOrderValue = Number(edit.minOrderValue)
    const maxOrderValue = Number(edit.maxOrderValue)
    const deliveryFee = Number(edit.deliveryFee)
    if (!Number.isFinite(minOrderValue) || !Number.isFinite(maxOrderValue) || !Number.isFinite(deliveryFee)) {
      toast.error("Fill all slab fields")
      return
    }
    if (minOrderValue < 0 || maxOrderValue < 0 || deliveryFee < 0) {
      toast.error("Values must be 0 or greater")
      return
    }
    if (minOrderValue >= maxOrderValue) {
      toast.error("Min order value must be less than max order value")
      return
    }

    const existing = getDistanceRuleConfig(ruleId)?.priceSlabs || []
    const overlap = existing.some((s, i) => {
      if (i === edit.index) return false
      return (
        (minOrderValue >= s.minOrderValue && minOrderValue < s.maxOrderValue) ||
        (maxOrderValue > s.minOrderValue && maxOrderValue <= s.maxOrderValue) ||
        (minOrderValue <= s.minOrderValue && maxOrderValue >= s.maxOrderValue)
      )
    })
    if (overlap) {
      toast.error("This price slab overlaps with an existing slab")
      return
    }

    setDistanceRuleConfig(ruleId, (cfg) => {
      const slabs = [...(cfg.priceSlabs || [])]
      slabs[edit.index] = { minOrderValue, maxOrderValue, deliveryFee, isActive: true }
      return { ...cfg, priceSlabs: slabs.sort((a, b) => a.minOrderValue - b.minOrderValue) }
    })
    handleCancelEditPriceSlab(ruleId)
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery & Platform Fee</h1>
        </div>
        <p className="text-sm text-slate-600">Configure delivery fee, platform fee, and GST settings for orders</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Fee Configuration</h2>
              <p className="text-sm text-slate-500 mt-1">Distance slab + order-value slab based delivery fee configuration</p>
            </div>
            <Button onClick={handleSaveFeeSettings} disabled={savingFeeSettings || loadingFeeSettings} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
              {savingFeeSettings ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Save className="w-4 h-4" />Save Settings</>}
            </Button>
          </div>

          {loadingFeeSettings ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-green-600" /></div>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Delivery Fee by Distance + Order Value</h3>
                <p className="text-sm text-slate-500 mb-4">Distance slabs are reflected from Delivery Boy Commission page.</p>
                <div className="space-y-4">
                  {distanceRules.map((rule) => {
                    const ruleCfg = getDistanceRuleConfig(rule._id)
                    const adminCommissionCfg = getDistanceRuleAdminCommissionConfig(rule._id) || { isEnabled: false, adminDeliveryCommissionPercent: 0 }
                    const slabs = Array.isArray(ruleCfg?.priceSlabs) ? ruleCfg.priceSlabs : []
                    const form = newPriceSlabByRule[String(rule._id)] || { minOrderValue: "", maxOrderValue: "", deliveryFee: "" }
                    const label = rule.maxDistance == null ? `${rule.minDistance}+ km` : `${rule.minDistance}-${rule.maxDistance} km`
                    return (
                      <div key={rule._id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-slate-800">{rule.name || "Distance Slab"} • {label}</h4>
                        </div>

                        {slabs.length > 0 && (
                          <div className="mb-3 overflow-x-auto">
                            <table className="w-full border border-slate-200 rounded-lg">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 border-b">Min Order (Rs)</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 border-b">Max Order (Rs)</th>
                                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 border-b">Per Km Rate (Rs)</th>
                                  <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 border-b">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {slabs.map((s, idx) => (
                                  <tr key={`${rule._id}-${idx}`} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 text-sm border-b">
                                      {editingPriceSlabByRule[String(rule._id)]?.index === idx ? (
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={editingPriceSlabByRule[String(rule._id)]?.minOrderValue ?? ""}
                                          onChange={(e) =>
                                            setEditingPriceSlabByRule((prev) => ({
                                              ...prev,
                                              [String(rule._id)]: {
                                                ...prev[String(rule._id)],
                                                minOrderValue: e.target.value,
                                              },
                                            }))
                                          }
                                          className="w-full px-2 py-1 border border-slate-300 rounded"
                                        />
                                      ) : (
                                        <>Rs {s.minOrderValue}</>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-sm border-b">
                                      {editingPriceSlabByRule[String(rule._id)]?.index === idx ? (
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={editingPriceSlabByRule[String(rule._id)]?.maxOrderValue ?? ""}
                                          onChange={(e) =>
                                            setEditingPriceSlabByRule((prev) => ({
                                              ...prev,
                                              [String(rule._id)]: {
                                                ...prev[String(rule._id)],
                                                maxOrderValue: e.target.value,
                                              },
                                            }))
                                          }
                                          className="w-full px-2 py-1 border border-slate-300 rounded"
                                        />
                                      ) : (
                                        <>Rs {s.maxOrderValue}</>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-sm font-medium text-green-700 border-b">
                                      {editingPriceSlabByRule[String(rule._id)]?.index === idx ? (
                                        <input
                                          type="number"
                                          min="0"
                                          step="0.01"
                                          value={editingPriceSlabByRule[String(rule._id)]?.deliveryFee ?? ""}
                                          onChange={(e) =>
                                            setEditingPriceSlabByRule((prev) => ({
                                              ...prev,
                                              [String(rule._id)]: {
                                                ...prev[String(rule._id)],
                                                deliveryFee: e.target.value,
                                              },
                                            }))
                                          }
                                          className="w-full px-2 py-1 border border-slate-300 rounded text-slate-900 font-normal"
                                        />
                                      ) : (
                                        <>Rs {s.deliveryFee}</>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-center border-b">
                                      <div className="flex items-center justify-center gap-2">
                                        {editingPriceSlabByRule[String(rule._id)]?.index === idx ? (
                                          <>
                                            <button onClick={() => handleSaveEditPriceSlab(rule._id)} className="p-1.5 text-green-700 hover:bg-green-50 rounded transition-colors" title="Save">
                                              <Check className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleCancelEditPriceSlab(rule._id)} className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors" title="Cancel">
                                              <X className="w-4 h-4" />
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <button onClick={() => handleStartEditPriceSlab(rule._id, idx, s)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                                              <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeletePriceSlab(rule._id, idx)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <input type="number" min="0" step="0.01" value={form.minOrderValue} onChange={(e) => setNewPriceSlabByRule((prev) => ({ ...prev, [String(rule._id)]: { ...form, minOrderValue: e.target.value } }))} className="px-3 py-2 text-sm border border-slate-300 rounded-lg" placeholder="Min Order (Rs)" />
                            <input type="number" min="0" step="0.01" value={form.maxOrderValue} onChange={(e) => setNewPriceSlabByRule((prev) => ({ ...prev, [String(rule._id)]: { ...form, maxOrderValue: e.target.value } }))} className="px-3 py-2 text-sm border border-slate-300 rounded-lg" placeholder="Max Order (Rs)" />
                            <input type="number" min="0" step="0.01" value={form.deliveryFee} onChange={(e) => setNewPriceSlabByRule((prev) => ({ ...prev, [String(rule._id)]: { ...form, deliveryFee: e.target.value } }))} className="px-3 py-2 text-sm border border-slate-300 rounded-lg" placeholder="Per Km Rate (Rs)" />
                            <Button onClick={() => handleAddPriceSlab(rule._id)} className="bg-green-600 hover:bg-green-700 text-white text-sm w-full flex items-center justify-center gap-2">
                              <Plus className="w-4 h-4" />Add Slab
                            </Button>
                          </div>
                        </div>

                        <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <p className="text-sm font-semibold text-slate-800">Admin Delivery Commission</p>
                            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                              <input
                                type="checkbox"
                                checked={adminCommissionCfg.isEnabled === true}
                                onChange={(e) =>
                                  setDistanceRuleAdminCommissionConfig(rule._id, (cfg) => ({
                                    ...cfg,
                                    isEnabled: e.target.checked,
                                  }))
                                }
                              />
                              Enabled
                            </label>
                          </div>
                          <div className="mt-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={adminCommissionCfg.adminDeliveryCommissionPercent ?? 0}
                              onChange={(e) =>
                                setDistanceRuleAdminCommissionConfig(rule._id, (cfg) => ({
                                  ...cfg,
                                  adminDeliveryCommissionPercent: e.target.value,
                                }))
                              }
                              className="w-full md:w-64 px-3 py-2 text-sm border border-slate-300 rounded-lg"
                              placeholder="Admin Delivery Commission (%)"
                            />
                            <p className="text-xs text-slate-500 mt-1">When enabled, this percent is cut from customer delivery fee for this distance slab.</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {distanceRules.length === 0 && (
                    <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg p-4">
                      No distance slabs found. Please configure Delivery Boy Commission first.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-6 mt-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">Platform Fee (Rs)</label>
                  <input type="number" value={feeSettings.platformFee} onChange={(e) => setFeeSettings({ ...feeSettings, platformFee: e.target.value })} min="0" step="1" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="5" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">GST Rate (%)</label>
                  <input type="number" value={feeSettings.gstRate} onChange={(e) => setFeeSettings({ ...feeSettings, gstRate: e.target.value })} min="0" max="100" step="0.1" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" placeholder="5" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
