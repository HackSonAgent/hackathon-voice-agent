import ContentSection from '../components/content-section'
import ProfileForm from './profile-form'

export default function SettingsProfile() {
  return (
    <ContentSection
      title='LLM Config'
      desc='This is how to setting AI config'
    >
      <ProfileForm />
    </ContentSection>
  )
}
