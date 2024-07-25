import {BodySheet} from "../components/BodySheet.tsx";
import {CreateOrganisation} from "../components/organisation/CreateOrganisation.tsx";
import {OrganisationList} from "../components/organisation/OrganisationList.tsx";
import {DebugBtn} from "../components/organisation/debugBtn.tsx";



export const Organisation = () => {
    return (
      <BodySheet>
          <CreateOrganisation/>
          <OrganisationList/>
          <DebugBtn/>
      </BodySheet>
    )
}
