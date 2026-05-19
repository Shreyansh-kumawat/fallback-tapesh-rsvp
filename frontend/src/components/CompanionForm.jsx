import { useFormContext, useFieldArray } from 'react-hook-form'
import { FiUserPlus, FiTrash2, FiUsers } from 'react-icons/fi'

const inputClass = `
  w-full bg-transparent border border-white/10 rounded-none
  px-4 py-3 text-white text-sm placeholder-white/25
  transition-all duration-200 focus:border-[#c9a84c]
`.trim()

const labelClass = 'block text-[0.6rem] tracking-[0.3rem] uppercase text-[#c9a84c]/70 mb-2'

export default function CompanionForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'companions',
  })

  const addCompanion = () => {
    if (fields.length >= 10) return
    append({ name: '', phone: '' })
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#c9a84c]/70">
          <FiUsers className="text-base" />
          <span className="text-[0.6rem] tracking-[0.3rem] uppercase">
            Saath Aane Wale ({fields.length}/10)
          </span>
        </div>
        <button
          type="button"
          onClick={addCompanion}
          disabled={fields.length >= 10}
          className="
            flex items-center gap-2 px-4 py-2 border border-[#c9a84c]/40
            text-[#c9a84c] text-[0.65rem] tracking-[0.2rem] uppercase
            hover:bg-[#c9a84c]/10 transition-all duration-200
            disabled:opacity-30 disabled:cursor-not-allowed
          "
        >
          <FiUserPlus className="text-sm" />
          Add Sadasya
        </button>
      </div>

      {/* Empty state */}
      {fields.length === 0 && (
        <div className="border border-dashed border-white/10 py-8 text-center">
          <FiUsers className="mx-auto text-2xl text-white/15 mb-2" />
          <p className="text-white/25 text-[0.75rem]">
            Koi saath nahi aa raha? &nbsp;Upar "Add Sadasya" dabaaein.
          </p>
        </div>
      )}

      {/* Companion cards */}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border border-white/8 p-4 relative"
          style={{ borderLeft: '2px solid rgba(201,168,76,0.35)' }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[0.55rem] tracking-[0.3rem] uppercase text-[#c9a84c]/50">
              Sadasya #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(index)}
              className="
                text-white/25 hover:text-red-400 transition-colors duration-200
                p-1 hover:bg-red-400/10
              "
              title="Hatayen"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Naam */}
            <div>
              <label className={labelClass}>Naam *</label>
              <input
                {...register(`companions.${index}.name`, {
                  required: 'Naam zaroori hai',
                })}
                placeholder="Sadasya ka naam"
                className={inputClass}
              />
              {errors?.companions?.[index]?.name && (
                <p className="text-red-400 text-[0.65rem] mt-1">
                  {errors.companions[index].name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Mobile <span className="text-white/20 normal-case tracking-normal">(optional)</span></label>
              <input
                {...register(`companions.${index}.phone`, {
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: 'Valid 10 digit number',
                  },
                })}
                placeholder="10 digit number"
                maxLength={10}
                className={inputClass}
              />
              {errors?.companions?.[index]?.phone && (
                <p className="text-red-400 text-[0.65rem] mt-1">
                  {errors.companions[index].phone.message}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Max reached */}
      {fields.length >= 10 && (
        <p className="text-[#c9a84c]/40 text-[0.65rem] text-center tracking-widest uppercase">
          Maximum 10 sadasya add ho sakte hain
        </p>
      )}

    </div>
  )
}
