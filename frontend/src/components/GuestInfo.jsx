import { useFormContext, Controller } from 'react-hook-form'
import { FiUser, FiMail } from 'react-icons/fi'
import PhoneField from './PhoneField'

const inputClass = `
  w-full bg-transparent border border-white/10 rounded-none
  px-4 py-3 text-white text-sm placeholder-white/25
  transition-all duration-200 focus:border-[#c9a84c]
  focus:shadow-[0_0_0_2px_rgba(201,168,76,0.12)]
`.trim()

const labelClass = 'block text-[0.6rem] tracking-[0.3rem] uppercase text-[#c9a84c]/70 mb-2'

const IconWrap = ({ children }) => (
  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-sm">
    {children}
  </span>
)

export default function GuestInfo() {
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext()

  const isAttending = watch('is_attending')

  return (
    <div className="space-y-6">

      {/* Naam */}
      <div>
        <label className={labelClass}>Aapka Naam *</label>
        <div className="relative">
          <IconWrap><FiUser /></IconWrap>
          <input
            {...register('guest_name', { required: 'Naam zaroori hai' })}
            placeholder="Poora naam likhein"
            className={`${inputClass} pl-9`}
          />
        </div>
        {errors.guest_name && (
          <p className="text-red-400 text-[0.7rem] mt-1">{errors.guest_name.message}</p>
        )}
      </div>

      {/* Phone — searchable country code dropdown */}
      <Controller
        name="guest_phone"
        control={control}
        defaultValue="+91|"
        rules={{
          validate: (val) => {
            const [, num] = (val || '').split('|')
            if (!num || num.length < 5) return 'Valid mobile number daalen'
            return true
          },
        }}
        render={({ field }) => (
          <PhoneField
            value={field.value || '+91|'}
            onChange={field.onChange}
            error={errors.guest_phone?.message}
            required
            label="Mobile Number"
            placeholder="Number daalen"
          />
        )}
      />

      {/* Email — optional */}
      <div>
        <label className={labelClass}>Email <span className="text-white/20 normal-case tracking-normal">(optional)</span></label>
        <div className="relative">
          <IconWrap><FiMail /></IconWrap>
          <input
            {...register('guest_email', {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Valid email daalen',
              },
            })}
            placeholder="example@email.com"
            className={`${inputClass} pl-9`}
          />
        </div>
        {errors.guest_email && (
          <p className="text-red-400 text-[0.7rem] mt-1">{errors.guest_email.message}</p>
        )}
      </div>

      {/* Attending Toggle */}
      <div>
        <label className={labelClass}>Kya aap aa rahe hain? *</label>
        <div className="flex gap-3 mt-1">
          <button
            type="button"
            onClick={() => setValue('is_attending', true, { shouldValidate: true })}
            className={`
              flex-1 py-3 text-[0.7rem] tracking-[0.25rem] uppercase transition-all duration-200 border
              ${
                isAttending === true
                  ? 'bg-[#c9a84c] text-[#0d0d0d] border-[#c9a84c] font-semibold'
                  : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
              }
            `}
          >
            ✓ &nbsp; Haan, aa raha / rahi hoon
          </button>
          <button
            type="button"
            onClick={() => setValue('is_attending', false, { shouldValidate: true })}
            className={`
              flex-1 py-3 text-[0.7rem] tracking-[0.25rem] uppercase transition-all duration-200 border
              ${
                isAttending === false
                  ? 'bg-red-500/80 text-white border-red-500 font-semibold'
                  : 'bg-transparent text-white/40 border-white/10 hover:border-white/30'
              }
            `}
          >
            ✗ &nbsp; Nahi aa sakta / sakti
          </button>
        </div>
        {errors.is_attending && (
          <p className="text-red-400 text-[0.7rem] mt-1">{errors.is_attending.message}</p>
        )}
      </div>

    </div>
  )
}
