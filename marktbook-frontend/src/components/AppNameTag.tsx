interface tag {
    tagline?: string
}

const AppNameTag = ({ tagline }: tag ) => (
  <>
    <div className='app-name'> MarktBook </div>
    <div className='summary'>
      <p className="catch-phrase">
        { tagline ?? 'Manage your business, smarter and simpler.'}
      </p>
    </div>
  </>
)

export default AppNameTag