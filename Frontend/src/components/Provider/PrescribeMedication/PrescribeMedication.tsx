import { useEffect, useState } from "react";
import type { CommonRouteProps, PatientEO } from "../../../utils/Interfaces";
import axios from "axios";
import { APIEndpoints } from "../../../api/api";
import CommonHeading from "../../Common/CommonHeading";

const PrescribeMedication = ({}: CommonRouteProps) => {
  const [patientData, setPatientData] = useState<PatientEO | undefined>(
    undefined
  );
  console.log(patientData);
  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    const getUserData = async () => {
      try {
        const user = await axios.get(
          `${APIEndpoints.UserProfile}?PatientId=${patientId}`
        );
        const fetchedUser = user.data;
        if (fetchedUser !== null && fetchedUser) {
          setPatientData(fetchedUser as PatientEO);
        } else {
          setPatientData(undefined);
          console.warn("Unknown role, cannot assign user type");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
  }, []);
  return (
    <div className="w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <CommonHeading
        heading={`Prescribe Medication`}
        subHeading={`Create a new prescription for your patient`}
      />

      <div
        id="prescribe-patient-info"
        className="bg-white rounded-lg shadow-sm p-6 border border-beige-100 mb-8"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-beige-200 flex items-center justify-center text-brown-600 mr-4">
                <span>JD</span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-brown-700">John Doe</h3>
                <p className="text-sm text-brown-500">
                  ID: P-12345678 • DOB: 06/15/1985 (38 years)
                </p>
              </div>
            </div>
          </div>
          <div>
            <button
              id="change-patient-btn"
              className="bg-beige-100 hover:bg-beige-200 text-brown-600 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
            >
              <i className="fas fa-exchange-alt mr-2"></i>
              Change Patient
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-beige-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-brown-600 mb-2">
              Allergies
            </h4>
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                <span className="text-sm text-brown-700">Penicillin</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                <span className="text-sm text-brown-700">Sulfa Drugs</span>
              </div>
            </div>
          </div>

          <div className="bg-beige-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-brown-600 mb-2">
              Conditions
            </h4>
            <div className="space-y-1">
              <div className="flex items-center">
                <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-sm text-brown-700">Hypertension</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-sm text-brown-700">Type 2 Diabetes</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="text-sm text-brown-700">High Cholesterol</span>
              </div>
            </div>
          </div>

          <div className="bg-beige-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-brown-600 mb-2">
              Vitals (Last Visit: June 10, 2023)
            </h4>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-700">Blood Pressure:</span>
                <span className="text-sm text-brown-700">138/85 mmHg</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-700">Heart Rate:</span>
                <span className="text-sm text-brown-700">78 bpm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-700">Weight:</span>
                <span className="text-sm text-brown-700">185 lbs</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-brown-700 mb-4">
            Current Medications
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-beige-200">
              <thead className="bg-beige-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                  >
                    Medication
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                  >
                    Dosage
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                  >
                    Frequency
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-brown-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-beige-100">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brown-700">
                      Lisinopril
                    </div>
                    <div className="text-xs text-brown-400">ACE Inhibitor</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">10mg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">Once daily</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">Jan 15, 2023</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brown-500">
                    <button className="text-brown-500 hover:text-brown-700 mr-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-brown-500 hover:text-red-500">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brown-700">
                      Metformin
                    </div>
                    <div className="text-xs text-brown-400">Biguanide</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">500mg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">Twice daily</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">Feb 3, 2023</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brown-500">
                    <button className="text-brown-500 hover:text-brown-700 mr-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-brown-500 hover:text-red-500">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brown-700">
                      Atorvastatin
                    </div>
                    <div className="text-xs text-brown-400">Statin</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">20mg</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">Once daily</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">Jan 15, 2023</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-brown-700">-</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brown-500">
                    <button className="text-brown-500 hover:text-brown-700 mr-2">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-brown-500 hover:text-red-500">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div id="prescription-history" className="p-6 mb-10">
        <div className="border-b border-beige-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              className="records-tab border-transparent text-brown-400 hover:text-brown-500 hover:border-brown-300 whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm"
              data-tab="prescription-history"
            >
              Prescription History
            </button>
          </nav>
        </div>
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            <li>
              <div className="relative pb-8">
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-beige-200"
                  aria-hidden="true"
                ></span>
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center ring-8 ring-white">
                      <i className="fas fa-edit text-yellow-600"></i>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm text-brown-700">
                        <span className="font-medium">Dr. Sarah Johnson</span>
                        updated dosage for
                        <span className="font-medium">Lisinopril</span> from
                        <span className="font-medium">5mg</span> to
                        <span className="font-medium">10mg</span>
                      </div>
                      <p className="mt-0.5 text-xs text-brown-400">
                        May 15, 2023 at 10:30 AM
                      </p>
                      <p className="mt-2 text-sm text-brown-500">
                        Reason: Blood pressure not adequately controlled with
                        5mg dose.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-beige-200"
                  aria-hidden="true"
                ></span>
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
                      <i className="fas fa-prescription text-green-600"></i>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm text-brown-700">
                        <span className="font-medium">Dr. Sarah Johnson</span>
                        prescribed
                        <span className="font-medium">Atorvastatin 20mg</span>
                      </div>
                      <p className="mt-0.5 text-xs text-brown-400">
                        February 3, 2023 at 2:15 PM
                      </p>
                      <p className="mt-2 text-sm text-brown-500">
                        Reason: LDL cholesterol above target range.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-beige-200"
                  aria-hidden="true"
                ></span>
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
                      <i className="fas fa-prescription text-green-600"></i>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm text-brown-700">
                        <span className="font-medium">Dr. Sarah Johnson</span>
                        prescribed
                        <span className="font-medium">Metformin 500mg</span>
                      </div>
                      <p className="mt-0.5 text-xs text-brown-400">
                        February 3, 2023 at 2:15 PM
                      </p>
                      <p className="mt-2 text-sm text-brown-500">
                        Reason: HbA1c of 7.2%, indicating Type 2 Diabetes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative">
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
                      <i className="fas fa-prescription text-green-600"></i>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm text-brown-700">
                        <span className="font-medium">Dr. Sarah Johnson</span>
                        prescribed
                        <span className="font-medium">Lisinopril 5mg</span>
                      </div>
                      <p className="mt-0.5 text-xs text-brown-400">
                        January 15, 2023 at 9:45 AM
                      </p>
                      <p className="mt-2 text-sm text-brown-500">
                        Reason: Hypertension diagnosis with consistent BP
                        readings 140/90.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 border border-beige-100">
        <h3 className="text-lg font-medium text-brown-700 mb-6">
          New Prescription
        </h3>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Medication Name
              </label>
              <input
                type="text"
                id="medication-name"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                placeholder="Enter medication name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Medication Class
              </label>
              <select
                id="medication-class"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
              >
                <option value="">Select class</option>
                <option value="ace">ACE Inhibitor</option>
                <option value="arb">ARB</option>
                <option value="biguanide">Biguanide</option>
                <option value="statin">Statin</option>
                <option value="beta">Beta Blocker</option>
                <option value="diuretic">Diuretic</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Dosage
              </label>
              <input
                type="text"
                id="dosage"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                placeholder="e.g., 10mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Form
              </label>
              <select
                id="form"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
              >
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="liquid">Liquid</option>
                <option value="injection">Injection</option>
                <option value="patch">Patch</option>
                <option value="inhaler">Inhaler</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Frequency
              </label>
              <select
                id="frequency"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
              >
                <option value="once">Once daily</option>
                <option value="twice">Twice daily</option>
                <option value="three">Three times daily</option>
                <option value="four">Four times daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="prn">As needed (PRN)</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Route
              </label>
              <select
                id="route"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
              >
                <option value="oral">Oral</option>
                <option value="topical">Topical</option>
                <option value="inhalation">Inhalation</option>
                <option value="injection">Injection</option>
                <option value="sublingual">Sublingual</option>
                <option value="rectal">Rectal</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Quantity
              </label>

              <input
                type="number"
                id="quantity"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                placeholder="e.g., 30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Refills
              </label>
              <input
                type="number"
                id="refills"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                placeholder="e.g., 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                End Date (if applicable)
              </label>
              <input
                type="date"
                id="end-date"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Special Instructions
              </label>

              <textarea
                id="instructions"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                placeholder="e.g., Take with food, avoid alcohol, etc."
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Provider Notes (not visible to patient)
              </label>
              <textarea
                id="notes"
                className="bg-beige-50 border border-beige-200 text-brown-700 text-sm rounded-lg focus:ring-brown-400 focus:border-brown-400 block w-full p-2.5"
                placeholder="Internal notes about this prescription"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="bg-beige-100 text-brown-600 hover:bg-beige-200 mr-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-brown-500 hover:bg-brown-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="ml-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Submit Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescribeMedication;
